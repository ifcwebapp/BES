﻿using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetCreditToPrivateSectorChart(string id, string countryCode, string yearConfig)
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
                out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config, false);

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

                List<int> categoryIds;
                GetCategoryOrder(requestedCountryId, cleanedData, countries, countryList, true, out categoryIds);

                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanedData, years, years.ToDictionary(y => y, y => y.ToString()), g => g.CountryId,
                    SeriesType.Line,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.Year, d => new Point { Value = d },
                    out cats, out sers);
                foreach (var ser in sers)
                {
                    ser.SerieCountryType = getSerieCountryType(ser.Id, countries);
                }
                //sers = sers.OrderBy(s => s.SerieCountryType).ToList();
                var catDic = categoryIds.ToDictionary(i => i, i => categoryIds.IndexOf(i));
                sers = sers.OrderBy(s => catDic[s.Id]).ToList();

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
