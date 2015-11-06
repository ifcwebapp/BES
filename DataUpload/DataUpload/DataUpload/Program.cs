using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using log4net;
using log4net.Core;
using OfficeOpenXml;

namespace DataUpload
{
    internal class Country
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Income { get; set; }
        public string Region { get; set; }
        public string RegionLowIncome { get; set; }
        public string RegionEconomical { get; set; }
        public int SheetIndex { get; set; }
    }

    internal class Indicator
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    internal class IndicatorValue
    {
        public int IndicatorId { get; set; }
        public int Year { get; set; }
        public int CountryId { get; set; }
        public double Value { get; set; }
    }

    internal class Document
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public string Countries { get; set; }
        public string Type { get; set; }
        public List<int> CountryIds { get; set; }
        public int TypeId { get; set; }
    }

    internal class OtherResource
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public int CountryId { get; set; }
    }

    internal class Project
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public string ProjectId { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public String Type { get; set; }
        public String Status { get; set; }
        public double? Amount { get; set; }
    }

    class Program
    {
        private static log4net.ILog log;
        static void Main(string[] args)
        {
            Logger.Setup();
            log = LogManager.GetLogger("default");

            try
            {
                if (args.Length != 2)
                {
                    log.Error(
                        "Wrong number of arguments: expected 2 - type of request and file name without spaces in it");
                    return;
                }
                switch (args[0])
                {
                    case "indicatorValues":
                        UploadMoreData(args[1]);
                        break;
                    case "projects":
                        UploadProjects(args[1]);
                        break;
                }

                log.Info("Load is completed");
            }
            catch (Exception e)
            {
                log.Error(e.ToString());
            }

        }

        private static DateTime? ParseTime(string s, int rowIndex)
        {
            DateTime result;
            if (DateTime.TryParse(s, out result))
            {
                return result;
            }
            else
            {
                try
                {
                    var d = s.Split('T')[0];
                    return DateTime.ParseExact(d, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                }
                catch (Exception)
                {
                    log.ErrorFormat("Date string {0} in row {1} cannot be recognized", s, rowIndex);
                    return null;
                }
                
            }

        }

        private static string GetValue(ExcelWorksheet sheet, int row, int column)
        {
            if (sheet.Cells[row, column].Value != null)
            {
                return sheet.Cells[row, column].Value.ToString().Trim();
            }
            else
            {
                return String.Empty; 
            }
        }

        private static void UploadProjects(string fileName)
        {
            var countries = GetCountries().ToDictionary(c => c.Name, c => c);

            var fi = new FileInfo(fileName);
            using (var p = new ExcelPackage(fi))
            {
                var sheet = p.Workbook.Worksheets[1];
                var loadCandidates = new List<Project>();
                int i = 2;
                int errors = 0;
                while (true)
                {
                    var countryName = GetValue(sheet, i, 1);
                    if (String.IsNullOrEmpty(countryName)) break;
                    Country country = null;
                    if (!countries.ContainsKey(countryName))
                    {
                        log.Error(String.Format("Country {0} does not exist", countryName));
                        errors++;
                    }
                    else
                    {
                        country = countries[countryName];
                    }
                    var projectStatus = GetValue(sheet, i, 2);
                    var projectId = GetValue(sheet, i, 3);
                    var projectName = GetValue(sheet, i, 4);
                    var amountString = GetValue(sheet, i, 5);
                    var approvalDateString = GetValue(sheet, i, 6);
                    var projectType = GetValue(sheet, i, 7);
                    var projectLink = GetValue(sheet, i, 8);

                    double amount;
                    if (!Double.TryParse(amountString, out amount))
                    {
                        log.ErrorFormat("Amount {0} in row {1} should be floating point number", amountString, i);
                        errors++;
                    }
                    var approvalDate = ParseTime(approvalDateString, i);
                    if (!approvalDate.HasValue) errors++;

                    var project = new Project
                    {
                        Amount = amount,
                        ApprovalDate = approvalDate.HasValue ? approvalDate.Value : DateTime.MinValue,
                        Country = countryName,
                        CountryCode = country != null ? country.Code : String.Empty,
                        Link = projectLink,
                        Name = projectName,
                        ProjectId = projectId,
                        Status = projectStatus,
                        Type = projectType
                    };

                    loadCandidates.Add(project);
                    i++;
                }
                if (errors == 0)
                {
                    LoadProjectsToDatabase(loadCandidates);
                }
            }
        }

        private static IEnumerable<Country> GetCountries()
        {
            var result = new List<Country>();
            using (var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["db"].ConnectionString))
            {
                sqlConnection.Open();
                using (var command = sqlConnection.CreateCommand())
                {
                    command.CommandText = "Select * from Country";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new Country
                            {
                                Code = (string)reader[1],
                                Name = (string)reader[2],
                                SheetIndex = (int)reader[0]
                            });
                        }
                    }
                }
            }

            return result;
        }

        private static IEnumerable<Indicator> GetIndicators()
        {
            var result = new List<Indicator>();
            using (var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["db"].ConnectionString))
            {
                sqlConnection.Open();
                using (var command = sqlConnection.CreateCommand())
                {
                    command.CommandText = "Select IndicatorId, IndicatorName from Indicator";
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new Indicator
                            {
                                Id = (int)reader[0],
                                Name = (string)reader[1]
                            });
                        }
                    }
                }
            }

            return result;
        }

        private static void UploadMoreData(string fileName)
        {
            var countries = GetCountries().ToDictionary(c => c.Code, c => c.SheetIndex);
            var indicators = GetIndicators().ToList();

            var fi = new FileInfo(fileName);
            using (var p = new ExcelPackage(fi))
            {
                var sheet = p.Workbook.Worksheets[1];
                var excelCountries = new Dictionary<int, string>();
                var j = 3;
                while (sheet.Cells[2, j].Value != null && sheet.Cells[2, j].Value.ToString() != String.Empty)
                {
                    var val = sheet.Cells[2, j].Value.ToString().Trim();
                    if (!countries.ContainsKey(val))
                    {
                        log.Error(String.Format("Country {0} does not exist", val));
                    }
                    else
                    {
                        excelCountries.Add(j, val);
                    }
                    j++;

                }

                var loadCandidates = new List<IndicatorValue>();
                int i = 3;
                while (true)
                {
                    var test = sheet.Cells[i, 1].Value;
                    if (test == null || String.IsNullOrEmpty(test.ToString().Trim())) break;
                    
                    var indicatorName = GetValue(sheet, i , 1);
                    var indicator = indicators.FirstOrDefault(ind => ind.Name.ToLower() == indicatorName.ToLower());
                    int indicatorIndex = -1;
                    if (indicator != null)
                    {
                        indicatorIndex = indicator.Id;
                    }
                    else
                    {
                        log.ErrorFormat("Indicator {0} is not found in database: skipped", indicatorName);
                        i++;
                        continue;
                    }
                    var year = sheet.Cells[i, 2].Value;
                    j = 3;
                    while (j <= excelCountries.Keys.Max())
                    {
                        var val = sheet.Cells[i, j].Value;
                        double dVal;
                        if (val != null && Double.TryParse(val.ToString(), out dVal))
                        {
                            if (excelCountries.ContainsKey(j))
                            {
                                loadCandidates.Add(new IndicatorValue
                                {
                                    IndicatorId = indicatorIndex,
                                    CountryId = countries[excelCountries[j]],
                                    Year = Convert.ToInt32(year),
                                    Value = dVal
                                });
                            }
                        }
                        j++;
                    }
                    i++;
                }

                LoadValuesToDatabase(loadCandidates);
            }
        }

        private static void LoadProjectsToDatabase(IEnumerable<Project> values)
        {
            using (var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["db"].ConnectionString))
            {
                sqlConnection.Open();
                using (var command = sqlConnection.CreateCommand())
                {
                    command.CommandText = "truncate table BankProjectStag";
                    command.ExecuteNonQuery();

                    foreach (var indicatorValue in values)
                    {

                        if (indicatorValue.CountryCode != null)
                        {
                            

                            command.CommandText =
                                "insert into BankProjectStag([CountryCode], [ProjectId], [ProjectName], [ApprovalDate], [ProjectType], [ProjectLink], [ProjectStatus], [Amount]) values(@v1, @v2, @v3, @v4, @v5, @v6, @v7, @v8)";

                            command.Parameters.Clear();
                            command.Parameters.AddRange(new[]
                            {
                                new SqlParameter("v1", indicatorValue.CountryCode),
                                new SqlParameter("v2", indicatorValue.ProjectId),
                                new SqlParameter("v3", indicatorValue.Name),
                                indicatorValue.ApprovalDate.HasValue ? new SqlParameter("v4", indicatorValue.ApprovalDate) : new SqlParameter("v4",  DBNull.Value),
                                new SqlParameter("v5", indicatorValue.Type),
                                String.IsNullOrEmpty(indicatorValue.Link) ? new SqlParameter("v6",  DBNull.Value) : new SqlParameter("v6", indicatorValue.Link),
                                new SqlParameter("v7", indicatorValue.Status),
                                !indicatorValue.Amount.HasValue ? new SqlParameter("v8",  DBNull.Value) : new SqlParameter("v8", indicatorValue.Amount.Value),
                            });
                            command.ExecuteNonQuery();
                        }
                    }
                }
            }
        }

        private static void LoadValuesToDatabase(IEnumerable<IndicatorValue> values)
        {
            using (var sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["db"].ConnectionString))
            {
                sqlConnection.Open();
                using (var command = sqlConnection.CreateCommand())
                {
                    command.CommandText =
                            "truncate table indicatorvaluestag";
                    command.ExecuteNonQuery();

                    command.CommandText =
                            "insert into indicatorvaluestag(indicatorid, countryid, year, indicatorvalue) values(@v1, @v2, @v3, @v4)";
                    foreach (var indicatorValue in values)
                    {

                        command.Parameters.Clear();
                        command.Parameters.AddRange(new[]
                                {
                                    new SqlParameter("v1", indicatorValue.IndicatorId),
                                    new SqlParameter("v2", indicatorValue.CountryId),
                                    new SqlParameter("v3", indicatorValue.Year),
                                    new SqlParameter("v4", indicatorValue.Value)
                                });
                        command.ExecuteNonQuery();
                    }
                }
            }
        }
    }
}
