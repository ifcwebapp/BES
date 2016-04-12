using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public KeyStatistics GetKeyStatistics(string countryCode)
        {
            return LogTime(() =>
            {
                Dictionary<string, Dictionary<string, List<string>>> config;
                DatabaseRepository db;
                IList<GetValuesResult> data;
                IList<int> years;
                int requestedCountryId;
                List<GetIndicatorsInfoResult> indicatorList;
                List<GetCountriesInfo_Result> countryList;
                List<GetSupportedIndicatorsResult> supportedIndicatorList;
                Dictionary<int, IList<int>> yearsPerIndicator;
                InitChartData("KeyStatistics", countryCode, null, false, true, false, false, out db, out data, out years,
                    out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorList, out config,
                    out yearsPerIndicator);

                var country = countryList.First(c => c.CountryId == requestedCountryId);
                var regionData = config.GetValue("RegionData");
                var regionId = country.GetRegionId(regionData,
                    isHighIncome: (country.IncomeId == 3 || country.IncomeId == 5));
                //var region = countryList.First(c => c.CountryType == 4);
                var region = countryList.First(c => c.CountryId == regionId);
                var result = new KeyStatistics
                {
                    CountryName = country.Name,
                    RegionName = region.Name,
                    Stats = new AllKeyStatistics
                    {
                        GrouthRate = new Stat {RegionName = region.Name},
                        ForeignInvestment = new Stat {RegionName = region.Name},
                        PerCapita = new Stat {RegionName = region.Name},
                        PopulationUnder = new Stat {RegionName = region.Name},
                        TotalInvestment = new Stat {RegionName = region.Name},
                        UnemploymentRate = new Stat {RegionName = region.Name},
                        Inflation = new Stat {RegionName = region.Name},
                        GiniIndex = new Stat {RegionName = region.Name}
                    }
                };

                var sources = db.GetStatisticsSources().ToDictionary(s => s.IndicatorId);

                var configYears = config.GetValue("Years");
                var yearNumbers = Utilities.ParseYears(configYears);
                //var woiYear = yearNumbers.Count > 0 ? yearNumbers[0] : 2014;
                var woiYear = DateTime.Now.Year;

                Action<Stat, GetIndicatorsInfoResult, GetValuesResult, GetValuesResult, StatisticsSource>
                    assignStatValue = (stat, indicator, countryRecord, regionRecord, source) =>
                    {
                        stat.Title = indicator.Name;
                        stat.SourceName = source.SourceName;
                        stat.SourceLink = source.SourceLink;
                        if (countryRecord != null)
                        {
                            stat.CountryValue = countryRecord.IndicatorValue.HasValue
                                ? (decimal?) Math.Round(countryRecord.IndicatorValue.Value, 1)
                                : null;
                            stat.CountryYear = countryRecord.Year;
                        }
                        if (regionRecord != null)
                        {
                            stat.RegionValue = regionRecord.IndicatorValue.HasValue
                                ? (decimal?) Math.Round(regionRecord.IndicatorValue.Value, 1)
                                : null;
                            stat.RegionYear = regionRecord.Year;
                        }
                    };

                var grops = data.GroupBy(i => i.IndicatorId);
                foreach (var g in grops)
                {
                    var indicator = indicatorList.First(i => i.IndicatorId == g.Key);
                    int year;
                    if (indicator.IndicatorSourceId == 15)
                    {
                        year = woiYear;
                    }
                    else
                    {
                        year = yearsPerIndicator.ContainsKey(g.Key) ? yearsPerIndicator[g.Key].Min() : -1;
                    }

                    var countryRecord = g.FirstOrDefault(r => r.CountryId == requestedCountryId && r.Year == year);
                    var regionRecord = g.FirstOrDefault(r => r.CountryId == region.CountryId && r.Year == year);
                    Stat stat = null;
                    var source = sources[indicator.IndicatorId];
                    switch (indicator.IndicatorName)
                    {
                        case
                            "Gross domestic product based on purchasing-power-parity (PPP) per capita GDP (current international dollar)"
                            :
                            stat = result.Stats.PerCapita;

                            break;
                        case "Gross domestic product, constant prices (percent change)":
                            stat = result.Stats.GrouthRate;
                            stat.ValueSuffix = "%";
                            break;
                        case "Total investment (percent of GDP)":
                            stat = result.Stats.TotalInvestment;
                            stat.ValueSuffix = "%";
                            break;
                        case "Poverty headcount ratio at $1.90 a day (PPP) (% of population)":
                            stat = result.Stats.PopulationUnder;
                            stat.ValueSuffix = "%";
                            break;
                        case "Foreign direct investment, net inflows (% of GDP)":
                            stat = result.Stats.ForeignInvestment;
                            stat.ValueSuffix = "%";
                            break;
                        case "Unemployment, total (% of total labor force) (modeled ILO estimate)":
                            stat = result.Stats.UnemploymentRate;
                            stat.ValueSuffix = "%";
                            break;
                        case "GINI index":
                            stat = result.Stats.GiniIndex;
                            break;
                        case "Inflation, average consumer prices (percent change)":
                            stat = result.Stats.Inflation;
                            stat.ValueSuffix = "%";
                            break;
                    }
                    assignStatValue(stat, indicator, countryRecord, regionRecord, source);

                }

                return result;
            }, "statistics for country {0}", countryCode);
        }
    }
}
