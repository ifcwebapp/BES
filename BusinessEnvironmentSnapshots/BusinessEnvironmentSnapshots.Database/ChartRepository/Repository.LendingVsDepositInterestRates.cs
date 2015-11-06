using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetLendingVsDepositInterestRatesChart(string id, string countryCode, string yearConfig)
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
            InitChartData(id, countryCode, yearConfig, false, true, false, false, out db, out data, out years,
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
                var firstIndicator = indicatorList.First();
                var cleanData = data.Where(d => d.IndicatorId == firstIndicator.IndicatorId);

                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanData, years, years.ToDictionary(y => y, y => y.ToString()), g => g.CountryId,
                    SeriesType.Line,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.Year, d => new Point { Value = d },
                    out cats, out sers);
                foreach (var ser in sers)
                {
                    ser.Name += " " + firstIndicator.Name.ToLower();
                }

                var lastIndicator = indicatorList.Last();
                cleanData = data.Where(d => d.IndicatorId == lastIndicator.IndicatorId);
                List<string> cats1;
                List<ChartSeries> sers1;
                ConvertToSeries(cleanData, years, years.ToDictionary(y => y, y => y.ToString()), g => g.CountryId,
                    SeriesType.Line,
                    countries.ToDictionary(k => k.Key, k => k.Value.Name), g => g.Year, d => new Point { Value = d },
                    out cats1, out sers1);
                foreach (var ser in sers1)
                {
                    ser.Name += " " + lastIndicator.Name.ToLower();
                }

                foreach (var ser in sers)
                {
                    ser.SerieCountryType = getSerieCountryType(ser.Id, countries);
                }

                foreach (var ser in sers1)
                {
                    if (getSerieCountryType(ser.Id, countries) == SerieCountryType.Country)
                    {
                        ser.SerieCountryType = SerieCountryType.DashedCountry; 
                    }
                    else
                    {
                        ser.SerieCountryType = SerieCountryType.DashedRegion;
                    }
                }

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers.Union(sers1).ToList()) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
