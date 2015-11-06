using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetCostToImportAndExportChart(string id, string countryCode, string yearConfig)
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
            InitChartData(id, countryCode, yearConfig, true, true, false, out db, out data, out years,
                out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config);

            var chartInfo = db.GetChartInfo(id);
            if (chartInfo != null)
            {
                var indicators = indicatorList.ToDictionary(i => i.IndicatorId);
                var countries = countryList.ToDictionary(c => c.CountryId);
                var supportedIndicators =
                    supportedIndicatorList.ToDictionary(i => new Tuple<int, int>(i.IndicatorId, i.IndicatorType));

                var dataDictionary = data.ToDictionary(
                    d => new Tuple<int, int, int>(d.CountryId, d.IndicatorId, d.Year), d => d.IndicatorValue);

                var supportedIndicatorIds =
                    supportedIndicatorList.Select(s => s.SupportedIndicatorId).Distinct().ToDictionary(i => i);
                var cleanedData = data.Where(d => !supportedIndicatorIds.ContainsKey(d.IndicatorId)).ToList();

                var selectedCountries = data.Select(d => d.CountryId)
                    .Distinct()
                    .ToDictionary(d => d, d => countries[d].Name);

                var categories = indicatorList.ToDictionary(i => i.IndicatorId, i => i.Name);

                var indicatorIds =
                    indicatorList.Select(i => i.IndicatorId).Where(i => !supportedIndicatorIds.ContainsKey(i)).ToList();

                List<int> categoryIds;
                GetCategoryOrderByTotal(requestedCountryId, cleanedData, countries, countryList, false, out categoryIds);

                List<string> cats;
                List<ChartSeries> sers;
                //ConvertToSeries(cleanedData,
                //    indicatorIds,
                //    indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.CountryId,
                //    "",
                //    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.IndicatorId, d => new Point { Value = d },
                //    out cats, out sers);

                ConvertToSeries(cleanedData,
                    //data.Select(d => d.CountryId).Distinct().OrderBy(cId => countries[cId].CountryType).ToList(),
                    categoryIds,
                    countryList.ToDictionary(y => y.CountryId, y => y.Name), g => g.IndicatorId,
                    SeriesType.Bar,
                    indicatorList.ToDictionary(k => k.IndicatorId, k => k.Name), g => g.CountryId, d => new Point { Value = d },
                    out cats, out sers);

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
