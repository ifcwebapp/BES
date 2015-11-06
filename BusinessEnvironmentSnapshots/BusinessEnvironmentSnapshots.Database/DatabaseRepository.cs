using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessEnvironmentSnapshots.Database.DB;
using log4net;

namespace BusinessEnvironmentSnapshots.Database
{
    public class DatabaseRepository
    {
        //public async Task<IList<GetValuesForCountry_Result>> GetDataByIndicator(string countryCode, string indicatorName)
        //{
        //    using (var entities = new BesEntities())
        //    {
        //        return await entities.GetValuesForCountry(countryCode, indicatorName).ToListAsync();
        //    }
        //}

        //public IList<GetValuesForCountryResult> GetDataByIndicator(IList<int> countryIds, IList<string> indicatorNames, int? startYear, int? endYear)
        //{
        //    using (var entities = new BesEntities())
        //    {
        //        var parameters = new List<SqlParameter>
        //        {
        //            GetParameter<int>("countryIds", GetDataTable(countryIds)),
        //            GetParameter<string>("indicatorNames", GetDataTable(indicatorNames))
        //        };
        //        var query = "exec [dbo].[GetValuesForCountry] @countryIds, @indicatorNames";
        //        Action<int?, string> addParameter = (val, name) =>
        //        {
        //            if (val.HasValue)
        //            {
        //                parameters.Add(new SqlParameter(name, val));
        //                query += ", " + name;

        //            }
        //        };
        //        addParameter(startYear, "@startYear");
        //        addParameter(endYear, "@endYear");
        //        //return entities.GetValuesForCountry(countryCode, indicatorName, startYear, endYear).ToList();
        //        var result = entities.Database.SqlQuery<GetValuesForCountryResult>(query, parameters.ToArray());
        //        return result.ToList();
        //    }
        //}

        private readonly ILog log;
        public DatabaseRepository()
        {
            log = LogManager.GetLogger("default");
        }

        private BesEntities GetEntities()
        {
            var entities = new BesEntities();
            return entities;
        }

        public IList<BankProject> GetBankProjects(string countryCode)
        {
            using (var entities = GetEntities())
            {
                return entities.BankProjects.Where(p => p.CountryCode.Trim() == countryCode).ToList();
            }
        }

        public GetChartInfo_Result GetChartInfo(string id)
        {
            using (var entities = GetEntities())
            {
                return entities.GetChartInfo(id).FirstOrDefault();
            }
        }

        //public IList<GetCountryInfo_Result> GetCountryInfo(string countryCode)
        //{
        //    using (var entities = new BesEntities())
        //    {
        //        return entities.GetCountryInfo(countryCode).ToList();
        //    }
        //}

        public IList<GetCountriesInfo_Result> GetCountriesInfo(string countryCode)
        {
            using (var entities = GetEntities())
            {
                return entities.GetCountriesInfo(countryCode).ToList();
            }
        }

        public IList<GetValuesForCountryResult> GetIndicatorsValues(IList<string> indicatorNames, IList<int> countryIds)
        {
            using (var entities = GetEntities())
            {
                var result = entities.Database.SqlQuery<GetValuesForCountryResult>("exec [dbo].[GetIndicatorsValues] @indicatorNames, @countryIds",
                    GetParameter<string>("indicatorNames", GetDataTable(indicatorNames)),
                    //GetParameter<int>("years", GetDataTable(years)),
                    GetParameter<int>("countryIds", GetDataTable(countryIds)));
                return result.ToList();
            }
        }

        public IList<GetValuesResult> GetValues(IList<int> indicatorIds, IList<int> countryIds)
        {
            using (var entities = GetEntities())
            {
                var result = entities.Database.SqlQuery<GetValuesResult>("exec [dbo].[GetValues] @indicatorIds, @countryIds",
                    GetParameter<int>("indicatorIds", GetDataTable(indicatorIds)),
                    GetParameter<int>("countryIds", GetDataTable(countryIds)));
                var data = result.ToList();
                foreach (var getValuesResult in data)
                {
                    if (getValuesResult.IndicatorValue.HasValue)
                    {
                        getValuesResult.IndicatorValue = Math.Round(getValuesResult.IndicatorValue.Value, 2);
                    }
                }

                return data;
            }
        }

        public IList<GetIndicatorsInfoResult> GetIndicatorsInfo(IList<string> indicatorNames)
        {
            using (var entities = GetEntities())
            {
                var result =
                    entities.Database.SqlQuery<GetIndicatorsInfoResult>(
                        "exec [dbo].[GetIndicatorsInfo] @indicatorNames",
                        GetParameter<string>("indicatorNames", GetDataTable(indicatorNames)));
                return result.ToList();
            }
        }

        public IList<GetSupportedIndicatorsResult> GetSupportedIndicators(IList<int> indicatorIds)
        {
            using (var entities = GetEntities())
            {
                var result =
                    entities.Database.SqlQuery<GetSupportedIndicatorsResult>(
                        "exec [dbo].[GetSupportedIndicatorsInfo] @indicatorIds",
                        GetParameter<int>("indicatorIds", GetDataTable(indicatorIds)));
                return result.ToList();
            }
        }

        public IList<Country> GetCountries()
        {
            using (var entities = GetEntities())
            {
                return entities.Countries.Where(c => c.RegionId != 0 && c.Visible).OrderBy(c => c.CountryName).ToList();
            }
        }

        public IList<GetAllTabs_Result> GetAllTabs()
        {
            using (var entities = GetEntities())
            {
                return entities.GetAllTabs().ToList();
            }
        }

        public IList<GetDocuments_Result> GetDocuments(string countryCode)
        {
            using (var entities = GetEntities())
            {
                return entities.GetDocuments(countryCode).ToList();
            }
        }

        public IList<GetOtherResources_Result> GetOtherResources(string countryCode)
        {
            using (var entities = GetEntities())
            {
                return entities.GetOtherResources(countryCode).ToList();
            }
        }

        public IList<StatisticsSource> GetStatisticsSources()
        {
            using (var entities = GetEntities())
            {
                return entities.StatisticsSources.ToList();
            }
        }

        private DataTable GetDataTable<T>(IEnumerable<T> values)
        {
            var table = new DataTable();
            table.Columns.Add("id", typeof(string));
            if (values != null)
            {
                foreach (var value in values)
                {
                    table.Rows.Add(value);
                }
            }
            return table;
        }

        private SqlParameter GetParameter<T>(string name, DataTable value)
        {
            var parameter = new SqlParameter("@" + name, SqlDbType.Structured);
            parameter.Value = value;
            if (typeof (T).Name == "String")
            {
                parameter.TypeName = "[dbo].[StringList]";
            }
            else
            {
                parameter.TypeName = "[dbo].[IntList]";
            }

            return parameter;
        }
    }
}
