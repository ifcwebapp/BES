﻿using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetOverallDistanceToFrontierChart(string id, string countryCode, string yearConfig)
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
                var cleanedData = data.Where(d => !supportedIndicatorIds.ContainsKey(d.IndicatorId));

                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanedData, years, years.ToDictionary(y => y, y => y.ToString()), g => g.CountryId,
                    SeriesType.Polar,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.Year, d => new AdditionalDataPoint { Value = d },
                    out cats, out sers);

                foreach (var serie in sers)
                {
                    for (int i = 0; i < serie.Values.Count; i++)
                    {
                        var point = serie.Values[i] as AdditionalDataPoint;
                        decimal? rank;
                        if (
                            dataDictionary.TryGetValue(
                                new Tuple<int, int, int>(serie.Id, supportedIndicatorIds.First().Key, years[i]),
                                out rank))
                        {
                            point.AdditionalLabel = String.Format("Rank: {0}", ((int?)Math.Round(rank.Value)).ToStrWithSuffix());
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
