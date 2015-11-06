using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        //private Chart GetDistanceToFrontierByIndicatorChart(string id, string countryCode, string yearConfig)
        //{
        //    Chart result = null;
        //    Dictionary<string, Dictionary<string, List<string>>> config;
        //    DatabaseRepository db;
        //    IList<GetValuesResult> data;
        //    IList<int> years;
        //    int requestedCountryId;
        //    List<GetIndicatorsInfoResult> indicatorList;
        //    List<GetCountriesInfo_Result> countryList;
        //    List<GetSupportedIndicatorsResult> supportedIndicatorList;
        //    InitChartData(id, countryCode, yearConfig, false, false, false, out db, out data, out years,
        //        out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config);

        //    var electricityIndicatorPrefix = "Getting Electricity";

        //    var chartInfo = db.GetChartInfo(id);
        //    if (chartInfo != null)
        //    {
        //        if (years.Count > 2)
        //        {
        //            var electricityIndicators =
        //                indicatorList.Where(ind => ind.IndicatorName.StartsWith(electricityIndicatorPrefix))
        //                    .Select(ind => ind.IndicatorId)
        //                    .ToList();

        //            for (int i = 0; i < data.Count; i++)
        //            {
        //                var record = data[i];
        //                if (electricityIndicators.Contains(record.IndicatorId) && record.Year == years[1])
        //                {
        //                    record.Year = years[0];
        //                }
        //            }

        //            data = data.Where(d => d.Year != years[1]).ToList();
        //        }

        //        var indicators = indicatorList.ToDictionary(i => i.IndicatorId);
        //        var countries = countryList.ToDictionary(c => c.CountryId);
        //        var supportedIndicators =
        //            supportedIndicatorList.ToDictionary(i => new Tuple<int, int>(i.IndicatorId, i.IndicatorType));

        //        var dataDictionary = data.ToDictionary(
        //            d => new Tuple<int, int, int>(d.CountryId, d.IndicatorId, d.Year), d => d.IndicatorValue);

        //        var supportedIndicatorIds =
        //            supportedIndicatorList.Select(s => s.SupportedIndicatorId).Distinct().ToDictionary(i => i);
        //        var cleanedData = data.Where(d => !supportedIndicatorIds.ContainsKey(d.IndicatorId));

        //        var categories = indicatorList.ToDictionary(i => i.IndicatorId, i => i.Name);

        //        var indicatorIds =
        //            indicatorList.Select(i => i.IndicatorId).Where(i => !supportedIndicatorIds.ContainsKey(i)).ToList();

        //        List<string> cats;
        //        List<ChartSeries> sers;
        //        ConvertToSeries(cleanedData,
        //            indicatorIds,
        //            indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.Year,
        //            "line",
        //            years.ToDictionary(k => k, k => k.ToString()), g => g.IndicatorId, d => new AdditionalDataPoint { Value = d },
        //            out cats, out sers);

        //        foreach (var serie in sers)
        //        {
        //            for (int i = 0; i < serie.Values.Count; i++)
        //            {

        //                var point = serie.Values[i] as AdditionalDataPoint;
        //                decimal? rank;
        //                if (
        //                    dataDictionary.TryGetValue(
        //                        new Tuple<int, int, int>(requestedCountryId, supportedIndicators[new Tuple<int, int>(indicatorIds[i], 1)].SupportedIndicatorId, serie.Id),
        //                        out rank))
        //                {
        //                    point.AdditionalLabel = String.Format("Rank: {0}", ((int?)Math.Round(rank.Value)).ToStrWithSuffix());
        //                }

        //                if (serie.Name == years[0].ToString() && cats[i].StartsWith(electricityIndicatorPrefix))
        //                {
        //                    point.AdditionalLabel = (!String.IsNullOrEmpty(point.AdditionalLabel) ? ", " : "") +
        //                                            "Actual year: " + years[1];
        //                }
        //            }
        //        }
        //        if (years.Count > 0)
        //        {
        //            result = CreateChart(chartInfo, years.First(), years.Last(), cats, sers);
        //        }
        //        else
        //        {
        //            result = CreateChart(chartInfo);
        //        }
        //    }

        //    return result;
        //}

        private SingleChart GetDistanceToFrontierByIndicatorChart(string id, string countryCode, string yearConfig)
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
            InitChartData(id, countryCode, yearConfig, false, false, false, out db, out data, out years,
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
                    SeriesType.Line,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.IndicatorId, d => new Point { Value = d },
                    out cats, out sers);
                foreach (var ser in sers)
                {
                    ser.SerieCountryType = getSerieCountryType(ser.Id, countries);
                    ser.Name = chartInfo.ChartYaxisTitle;
                }
                //sers.Add(new ChartSeries
                //{
                //    Id = 0,
                //    SeriesType = SeriesType.Line,
                //    Name = "No change",
                //    Values = categories.Select(c => new Point { Value = 0}).ToList(),
                //    SerieCountryType = SerieCountryType.NotCountry
                //});

                

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
