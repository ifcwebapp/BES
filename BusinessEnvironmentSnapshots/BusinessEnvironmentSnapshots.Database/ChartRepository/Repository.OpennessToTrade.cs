using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetOpennessToTradeChart(string id, string countryCode, string yearConfig)
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

                var categories = indicatorList.ToDictionary(i => i.IndicatorId, i => i.Name);

                var indicatorIds =
                    indicatorList.Select(i => i.IndicatorId).Where(i => !supportedIndicatorIds.ContainsKey(i)).ToList();

                List<int> categoryIds;
                GetCategoryOrderByTotal(requestedCountryId, cleanedData, countries, countryList, true, out categoryIds);

                List<string> cats;
                List<ChartSeries> sers;
                //ConvertToSeries(cleanedData,
                //    indicatorIds,
                //    indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.CountryId,
                //    SeriesType.StackedBar,
                //    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.IndicatorId, d => new AdditionalDataPoint { Value = d, AdditionalLabel = null },
                //    out cats, out sers);
                ConvertToSeries(cleanedData,
                    //data.Select(d => d.CountryId).Distinct().OrderBy(cId => countries[cId].CountryType).ToList(),
                    categoryIds,
                    countryList.ToDictionary(y => y.CountryId, y => y.Name), g => g.IndicatorId,
                    SeriesType.StackedBar,
                    indicatorList.ToDictionary(k => k.IndicatorId, k => k.Name), g => g.CountryId, d => new AdditionalDataPoint { Value = d, AdditionalLabel = null },
                    out cats, out sers);

                foreach (var serie in sers)
                {
                    for (int i = 0; i < serie.Values.Count; i++)
                    {
                        GetSupportedIndicatorsResult sp;
                        int spId = -1;
                        if (supportedIndicators.TryGetValue(new Tuple<int, int>(serie.Id, 4), out sp))
                        {
                            spId = sp.SupportedIndicatorId;
                        }

                        var point = serie.Values[i] as AdditionalDataPoint;
                        decimal? additionalValue;
                        if (
                            dataDictionary.TryGetValue(
                                new Tuple<int, int, int>(countryList.FirstOrDefault(c => c.CountryAlias == cats[i]).CountryId, spId, years.First()),
                                out additionalValue))
                        {
                            if (additionalValue.HasValue)
                            {
                                point.AdditionalLabel = indicators[spId].Name + ": " + additionalValue.Value.RoundAndStringify("B", 2, "N2");
                            }
                        }
                    }
                }

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
