using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessEnvironmentSnapshots.Database.Model;
using NCalc;

namespace BusinessEnvironmentSnapshots.Database
{
    static class Utilities
    {


        private static string RemovePrefixes(string title)
        {
            return title.Replace("(AVG)", "").Replace("(AVGd)", "").Replace("(WDI)", "").Replace("(ES)", "").Trim();
        }

        //public static void CleanTitles(this Chart chart)
        //{
        //    foreach (var series in chart.Data.Series)
        //    {
        //        series.Name = RemovePrefixes(series.Name);
        //        foreach (var value in series.Values)
        //        {
        //            value.Label = RemovePrefixes(value.Label);
        //        }
        //    }
        //}

        public static IList<int> ParseYears(string yearsConfig, IList<int> yearsFromDb)
        {
            var result = new List<int>();
            var max = yearsFromDb.Max();
            var min = yearsFromDb.Min();
            var periods = yearsConfig.Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries);
            foreach (var period in periods)
            {
                int val;
                // if value
                if (Int32.TryParse(period, out val) && yearsFromDb.Contains(val))
                {
                    result.Add(val);
                }
                else
                {
                    // if actual period
                    if (period.Contains("-"))
                    {
                        var bounds = period.Split(new[] {'-'}, StringSplitOptions.RemoveEmptyEntries);
                        if (bounds.Length != 2)
                        {
                            throw new ApplicationException("Incorrect period " + period);
                        }
                        var start = ParseYearConstant(bounds[0], min, max, yearsFromDb);
                        var end = ParseYearConstant(bounds[1], min, max, yearsFromDb);

                        for (var i = start; i <= end; i++)
                        {
                            result.Add(i);
                        }
                    }
                    // if year constant
                    else
                    {
                        result.Add(ParseYearConstant(period, min, max, yearsFromDb));
                    }
                }
            }



            return result;
        }

        public static IList<int> ParseYears(string yearsConfig)
        {
            var result = new List<int>();
            var periods = yearsConfig.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var period in periods)
            {
                int val;
                // if value
                if (Int32.TryParse(period, out val))
                {
                    result.Add(val);
                }
                
            }



            return result;
        }

        private static int ParseYearConstant(string year, int min, int max, IList<int> yearsFromDb)
        {
            int result;
            if (Int32.TryParse(year, out result))
            {
                if (result < min)
                {
                    result = min;
                }

                if (result > max)
                {
                    result = max;
                }
            }
            else
            {
                switch (year.ToLower())
                {
                    case "mostrecent":
                        result = max;
                        break;
                    case "lastrecent":
                        result = min;
                        break;
                    case "previousfrommostrecent":
                        if (yearsFromDb.Count > 1)
                        {
                            result = yearsFromDb[yearsFromDb.Count - 2];
                        }
                        break;
                    case "current":
                        result = DateTime.Now.Year;
                        break;
                }
                
            }

            return result;
        }
    }
}
