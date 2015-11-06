using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private SingleChart GetFirmsExpectedToPayBribesChart(string id, string countryCode, string yearConfig)
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
            InitChartData(id, countryCode, yearConfig, false, true, false, true, out db, out data, out years,
                out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config);

            var chartInfo = db.GetChartInfo(id);
            if (chartInfo != null)
            {
                var cleanedData = data.Where(d => d.CountryId == requestedCountryId);

                var indicatorIds =
                    indicatorList.Select(i => i.IndicatorId).ToList();

                List<string> cats;
                List<ChartSeries> sers;
                ConvertToSeries(cleanedData,
                    indicatorIds,
                    indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.Year,
                    SeriesType.Bar,
                    years.ToDictionary(k => k, k => k.ToString()), g => g.IndicatorId, d => new Point { Value = d },
                    out cats, out sers);

                var regionData = data.Where(d => d.CountryId != requestedCountryId && d.Year == years.Last());

                List<string> regionCats;
                List<ChartSeries> regionSeries;
                ConvertToSeries(regionData,
                    indicatorIds,
                    indicatorList.ToDictionary(y => y.IndicatorId, y => y.Name), g => g.CountryId,
                    SeriesType.Bar,
                    countryList.ToDictionary(k => k.CountryId, k => k.Name), g => g.IndicatorId, d => new Point { Value = d },
                    out regionCats, out regionSeries);

                sers.AddRange(regionSeries);

                result = years.Count > 0 ? CreateChart(chartInfo, years.First(), years.Last(), cats, sers) : CreateChart(chartInfo);
                SetStartOrEndValue(result, PointToSet.Min);
                SetStartOrEndValue(result, PointToSet.Max);
            }

            return result;
        }
    }
}
