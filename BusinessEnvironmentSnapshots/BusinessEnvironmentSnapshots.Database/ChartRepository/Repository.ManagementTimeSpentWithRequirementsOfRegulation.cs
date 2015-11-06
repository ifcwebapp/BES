using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetManagementTimeSpentWithRequirementsOfRegulationChart(string id, string countryCode, string yearConfig)
        {
            SingleChart result = null;
            Dictionary<string, Dictionary<string, List<string>>> config;
            DatabaseRepository db;
            IList<GetValuesResult> data;
            IList<int> years;
            int requestedCountryId;
            List<GetIndicatorsInfoResult> indicatorList;
            List<GetCountriesInfo_Result> countryList;
            List<GetSupportedIndicatorsResult> supportedIndicatorList;
            InitChartData(id, countryCode, yearConfig, true, true, false, false, out db, out data, out years,
                out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config);

            var countries = countryList.ToDictionary(c => c.CountryId);

            var countryGroups = data.GroupBy(r => r.CountryId);
            var cleanData = (from countryGroup in countryGroups let maxYear = countryGroup.Max(c => c.Year) select countryGroup.FirstOrDefault(c => c.Year == maxYear)).ToList();

            List<int> categoryIds;
            GetCategoryOrder(requestedCountryId, cleanData, countries, countryList, true, out categoryIds);

            var index = 0;
            var weightedCats = categoryIds.ToDictionary(c => c, c => index++);

            //cleanData = cleanData.OrderBy(c => countries[c.CountryId].CountryType).ToList();
            cleanData = cleanData.OrderBy(c => weightedCats[c.CountryId]).ToList();

            var chartInfo = db.GetChartInfo(id);
            if (chartInfo != null)
            {
                var indicatorIds =
                    indicatorList.Select(i => i.IndicatorId).ToList();

                var cats = cleanData.Select(r => countryList.FirstOrDefault(c => c.CountryId == r.CountryId).Name + " " + r.Year).ToList();
                
                var sers = new List<ChartSeries>
                {
                    new ChartSeries
                    {
                        Name = "Percent of time",
                        SeriesType = SeriesType.Column,
                        Values = cleanData.Select(r => new Point { Value = r.IndicatorValue}).ToList()
                    }
                };


                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
