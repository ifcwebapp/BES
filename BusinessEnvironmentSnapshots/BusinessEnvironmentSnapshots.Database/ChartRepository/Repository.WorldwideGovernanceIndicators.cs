using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetWorldwideGovernanceIndicatorsChart(string id, string countryCode, string yearConfig)
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
            InitChartData(id, countryCode, yearConfig, false, true, true, out db, out data, out years,
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
                var cleanedData = data.Where(d => !supportedIndicatorIds.ContainsKey(d.IndicatorId));

                var categories = indicatorList.ToDictionary(i => i.IndicatorId, i => i.Name);

                var indicatorIds =
                    indicatorList.Select(i => i.IndicatorId).Where(i => !supportedIndicatorIds.ContainsKey(i)).ToList();

                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanedData,
                    indicatorIds,
                    indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.CountryId,
                    SeriesType.Bar,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.IndicatorId,
                    d => new ErrorPoint { Value = d },
                    out cats, out sers);

                foreach (var serie in sers)
                {
                    for (int i = 0; i < serie.Values.Count; i++)
                    {
                        var point = serie.Values[i] as ErrorPoint;
                        decimal? rank;
                        GetSupportedIndicatorsResult supportedIndicatorsResult;
                        if (supportedIndicators.TryGetValue(new Tuple<int, int>(indicatorIds[i], 2), out supportedIndicatorsResult)
                            && dataDictionary.TryGetValue(
                                new Tuple<int, int, int>(serie.Id, supportedIndicatorsResult.SupportedIndicatorId,
                                    years.First()),
                                out rank))
                        {
                            point.Error = rank;
                        }
                    }
                }

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                result.Yaxis.Start = -2.5;
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
