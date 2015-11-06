using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetBiggestRegionalConstraintToFutureInvestmentChart(string id, string countryCode, string yearConfig)
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
            Dictionary<int, IList<int>> yearsPerIndicator;
            InitChartData(id, countryCode, yearConfig, false, true, false, false, out db, out data, out years,
                out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config, out yearsPerIndicator, true, false);

            var chartInfo = db.GetChartInfo(id);
            if (chartInfo != null)
            {
                var countries = countryList.ToDictionary(c => c.CountryId);
                var indicatorDictionary = indicatorList.ToDictionary(i => i.IndicatorId);
                var indicatorGroups = indicatorList.GroupBy(i => new { i.IndicatorGroupId, i.IndicatorGroupName }).ToList();

                var indicatorIds = indicatorList.Where(g => g.IndicatorGroupId == 2).Select(ind => ind.IndicatorId).Distinct().ToList();
                List<int> categoryIds;
                GetCategoryOrder(data, indicatorIds.ToList(), true, out categoryIds);

                var categories = new List<string>();
                var series = new List<ChartSeries>();
                //foreach (var indicatorGroup in indicatorGroups)
                for(var i = 0; i < indicatorGroups.Count(); i++)
                {
                    var indicatorGroup = indicatorGroups[i];
                    var serieName = indicatorGroup.Key.IndicatorGroupName;
                    //indicatorIds = indicatorGroup.Select(g => g.IndicatorId).ToList();
                    if (i == 1)
                    {
                        indicatorIds = categoryIds;
                    }
                    else
                    {
                        indicatorIds.Clear();
                        foreach (var catId in categoryIds)
                        {
                            indicatorIds.Add(indicatorList.Where(ind => ind.IndicatorAlias == indicatorDictionary[catId].IndicatorAlias && ind.IndicatorId != catId).Select(ind => ind.IndicatorId).FirstOrDefault());
                        }
                    }

                    List<string> cats;
                    List<ChartSeries> sers;
                    ConvertToSeries(data,
                        indicatorIds,
                        //categoryIds,
                        indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.CountryId,
                        SeriesType.Bar,
                        countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.IndicatorId,
                        d => new Point { Value = d },
                        out cats, out sers);
                    foreach (var ser in sers)
                    {
                        ser.Name = serieName;
                    }
                    series.AddRange(sers);
                    if (categories.Count == 0)
                    {
                        categories.AddRange(cats);
                    }
                }

                foreach (var s in series)
                {
                    foreach (var val in s.Values)
                    {
                        if (val.Value.HasValue)
                        {
                            val.Value = Math.Round(val.Value.Value * 100);
                        }
                    }
                }

                if (years.Count > 0)
                {
                    result = CreateChart(chartInfo, years.First(), years.Last(), categories, series);
                }
                else
                {
                    result = CreateChart(chartInfo);
                }

                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
