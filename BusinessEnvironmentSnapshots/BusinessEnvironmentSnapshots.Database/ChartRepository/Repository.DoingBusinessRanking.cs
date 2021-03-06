﻿using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetDoingBusinessRankingChart(string id, string countryCode, string yearConfig)
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
                var countries = countryList.ToDictionary(c => c.CountryId);
                
                var cleanedData = data;

                List<int> categoryIds;
                GetCategoryOrder(requestedCountryId, cleanedData, countries, countryList, false, out categoryIds);
                
                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanedData, 
                    //data.Select(d => d.CountryId).Distinct().OrderBy(cId => countries[cId].CountryType).ToList(), 
                    categoryIds,
                    countryList.ToDictionary(y => y.CountryId, y => y.Name), g => g.Year,
                    SeriesType.Bar,
                    years.ToDictionary(k => k, k => k.ToString()), g => g.CountryId, d => new Point { Value = d },
                    out cats, out sers);

                //foreach (var serie in sers)
                //{
                //    for (int i = 0; i < serie.Values.Count; i++)
                //    {
                //        var point = serie.Values[i] as AdditionalDataPoint;
                //        decimal? rank;
                //        if (
                //            dataDictionary.TryGetValue(
                //                new Tuple<int, int, int>(countryList[i].CountryId, supportedIndicatorIds.First().Key, serie.Id),
                //                out rank))
                //        {
                //            point.AdditionalLabel = String.Format("Rank: {0}", ((int?)Math.Round(rank.Value)).ToStrWithSuffix());
                //        }
                //    }
                //}

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                result.AreValuesInversed = true;
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
