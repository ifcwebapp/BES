using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.DB;
using BusinessEnvironmentSnapshots.Database.Model;
using log4net;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private readonly ILog log;
        public Repository()
        {
            log = LogManager.GetLogger("default");
        }

        private T LogTime<T>(Func<T> func, string message, params object[] parameters)
        {
            var sw = Stopwatch.StartNew();
            var result = func();
            sw.Stop();
            if (ConfigurationManager.AppSettings["addDbLogger"] == "true")
            {
                log.InfoFormat("\r\n Overall {0} took {1}\r\n-------------------\r\n", String.Format(message, parameters), sw.Elapsed);
            }
            return result;
        }

        public ISomeChart GetChart(string id, string countryCode, string years)
        {
            return LogTime(() =>
            {
                ISomeChart result;
                switch (id)
                {
                    case KnownChartIds.OverallDistanceToFrontier:
                        result = SomeChart.FromSingle(GetOverallDistanceToFrontierChart(id, countryCode, years));
                        break;
                    case KnownChartIds.DistanceToFrontierByIndicator:
                        var r1 = GetDistanceToFrontierByIndicatorChart(id, countryCode, years);
                        var r2 = GetReformsValidatedByDoingBusinessChart(KnownChartIds.ReformsValidatedByDoingBusiness,
                            countryCode,
                            years);
                        result = SomeChart.FromMulti(CreateMultiChart(
                            id, r1, new[] {0.0},
                            KnownChartIds.ReformsValidatedByDoingBusiness, r2, new[] {0.0}));
                        RoundChartValues(result, 2, 0);
                        break;
                    case KnownChartIds.GlobalCompetitivenessIndex:
                        result = SomeChart.FromSingle(GetGlobalCompetitivenessIndexChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.GlobalCompetitivenessPillars:
                        result = SomeChart.FromSingle(GetGlobalCompetitivenessPillarsChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.EnterpriseSurveysTopObstacles:
                        result = SomeChart.FromSingle(GetEnterpriseSurveysTopObstaclesChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.WorldwideGovernanceIndicators:
                        result = SomeChart.FromSingle(GetWorldwideGovernanceIndicatorsChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.BiggestRegionalConstraintToFutureInvestment:
                        result =
                            SomeChart.FromSingle(GetBiggestRegionalConstraintToFutureInvestmentChart(id, countryCode,
                                years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.OpennessToTrade:
                        result = SomeChart.FromSingle(GetOpennessToTradeChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ReportedRegionalInvestmentChanges:
                        result = SomeChart.FromSingle(GetReportedRegionalInvestmentChangesChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ControlOfCorruption:
                        result = SomeChart.FromSingle(GetControlOfCorruptionChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.FirmsExpectedToPayBribes:
                        result = SomeChart.FromSingle(GetFirmsExpectedToPayBribesChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ElectricityOutages:
                        result = SomeChart.FromSingle(GetElectricityOutagesChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.ContractEnforcementTime:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.StartingBusiness:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ConstructionPermittingTime:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.CostOfRegisteringProperty:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.InsolvencyRecoveryRate:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Desc));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.GettingElectricity:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.PayingTaxesHoursPerYear:
                        result =
                            SomeChart.FromSingle(GetContractEnforcementTimeChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.DoingBusinessRanking:
                        result = SomeChart.FromSingle(GetDoingBusinessRankingChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.DoingBusinessIndicators:
                        result = SomeChart.FromSingle(GetDoingBusinessIndicatorsChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.ProtectingMinorityInvestorsIndices:
                        result = SomeChart.FromSingle(GetProtectingMinorityInvestorsIndicesChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.ArbitratingCommercialDisputes:
                        result = SomeChart.FromSingle(GetArbitratingCommercialDisputesChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.RegulatoryQuality:
                        result = SomeChart.FromSingle(GetRegulatoryQualityChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.ManagementTimeSpentWithRequirementsOfRegulation:
                        result =
                            SomeChart.FromSingle(GetManagementTimeSpentWithRequirementsOfRegulationChart(id, countryCode,
                                years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.NewFirmRegistrationRate:
                        result = SomeChart.FromSingle(GetNewFirmRegistrationRateChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.GettingCreditIndices:
                        result = SomeChart.FromSingle(GetGettingCreditIndicesChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.PublicAndPrivateCreditCoverage:
                        result = SomeChart.FromSingle(GetPublicAndPrivateCreditCoverageChart(id, countryCode, years));
                        break;
                    case KnownChartIds.CreditToPrivateSector:
                        result = SomeChart.FromSingle(GetCreditToPrivateSectorChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.LendingVsDepositInterestRates:
                        result = SomeChart.FromSingle(GetLendingVsDepositInterestRatesChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.StrengthOfInsolvencyFrameworkIndices:
                        result =
                            SomeChart.FromSingle(GetStrengthOfInsolvencyFrameworkIndicesChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.BestPracticesForInvestmentPromotion:
                        result =
                            SomeChart.FromSingle(GetBestPracticesForInvestmentPromotionChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ForeignEquityOwnershipAllowed:
                        result = SomeChart.FromSingle(GetForeignEquityOwnershipAllowedChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.StartingForeignBusinessEaseEstablishmentIndex:
                        result =
                            SomeChart.FromSingle(GetStartingForeignBusinessChart(id, countryCode, years,
                                SortingDirection.Desc));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.StartingForeignBusinessNumberOfProcedures:
                        result =
                            SomeChart.FromSingle(GetStartingForeignBusinessChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.StartingForeignBusinessTimeToStart:
                        result =
                            SomeChart.FromSingle(GetStartingForeignBusinessChart(id, countryCode, years,
                                SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.AccessingIndustrialLand:
                        result = SomeChart.FromSingle(GetAccessingIndustrialLandChart(id, countryCode, years));
                        RoundChartValues(result, 1);
                        break;
                    case KnownChartIds.ElectricityAccess:
                        result = SomeChart.FromSingle(GetElectricityChart(id, countryCode, years, SortingDirection.Asc));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.ElectricityConsumption:
                        result = SomeChart.FromSingle(GetElectricityChart(id, countryCode, years, SortingDirection.None));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.CostToImportAndExport:
                        result = SomeChart.FromSingle(GetCostToImportAndExportChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.LogisticsPerformanceIndex:
                        result = SomeChart.FromSingle(GetLogisticsPerformanceIndexChart(id, countryCode, years));
                        RoundChartValues(result, 2);
                        break;
                    case KnownChartIds.PayingTaxesRates:
                        result = SomeChart.FromSingle(GetPayingTaxesRatesChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                    case KnownChartIds.MostProblematicFactors:
                        result = SomeChart.FromSingle(GetMostProblematicFactorsChart(id, countryCode, years));
                        RoundChartValues(result, 0);
                        break;
                        //case KnownChartIds.ReformsValidatedByDoingBusiness:
                        //    result = GetReformsValidatedByDoingBusinessChart(id, countryCode, years);
                        //    break;
                    default:
                        throw new ApplicationException("Unknown chart ID \"" + id + "\".");

                }


                return result;
            }, "chart {0} for country {1}", id, countryCode);
        }

        public IEnumerable<String> GetAllChartIds()
        {
            return KnownChartIds.AllChartIds;
        }

        private void RoundChartValues(ISomeChart someChart, int roundDigits, int secondRoundDigits = 0)
        {
            Action<int, List<ChartSeries>> convert = (digits, series) =>
            {
                foreach (var serie in series)
                {
                    foreach (var value in serie.Values)
                    {
                        if (value.Value.HasValue)
                        {
                            value.Value = Math.Round(value.Value.Value, digits);
                            value.ValueString = value.Value.ToString();
                            if (digits == 0)
                            {
                                value.Value = Convert.ToInt32(value.Value.Value);
                                value.ValueString = Convert.ToInt32(value.Value.Value).ToString();
                            }
                        }
                    }
                }
            };

            someChart.Resolve(ch =>
            {
                convert(roundDigits, ch.Series);
                return true;
            },
                ch =>
                {
                    for (int index = 0; index < ch.SeriesGroups.Count; index++)
                    {
                        var digits = index == 0 ? roundDigits : secondRoundDigits;
                        var seriesGroup = ch.SeriesGroups[index];
                        convert(digits, seriesGroup.Series);
                    }
                    return true;
                });
        }

        private SingleChart CreateChart(GetChartInfo_Result chartInfo, int min, int max, List<string> categories, List<ChartSeries> data)
        {
            foreach (var point in data.SelectMany(d => d.Values))
            {
                if (!String.IsNullOrEmpty(chartInfo.ChartValueSuffix))
                {
                    point.Suffix = chartInfo.ChartValueSuffix;
                }
            }
            return new SingleChart
            {
                Title = chartInfo.ChartTitle + (String.IsNullOrEmpty(chartInfo.ChartTitleYearSuffix) ? String.Empty : " " + String.Format(chartInfo.ChartTitleYearSuffix, min, max)),
                Description = chartInfo.ChartDescription,
                SourceLink = chartInfo.ChartSourceLink,
                SourceTitle = chartInfo.ChartSourceTitle,
                Xaxis = new Xaxis { Categories = categories },
                Yaxis = new Yaxis { Title = chartInfo.ChartYaxisTitle, ValueSuffix = chartInfo.ChartValueSuffix, Start = chartInfo.ChartYaxisMin.HasValue ? Convert.ToDouble(chartInfo.ChartYaxisMin.Value) : 0, End = chartInfo.ChartYaxisMax.HasValue ? Convert.ToDouble(chartInfo.ChartYaxisMax.Value) : 0 },
                //Tooltip = new Tooltip { ValueSuffix = chartInfo.ChartValueSuffix },
                Series = data,
                Note = chartInfo.ChartNote,
                AreValuesInversed= false,
                TableIndicatorColumn = chartInfo.TableIndicatorColumn,
                TableUnitLabel = chartInfo.TableUnitLabel
            };
        }

        private void SetStartOrEndValue(SingleChart chart, PointToSet pointToSet)
        {
            if (chart.Series.Any())
            {
                var a = chart.Series.SelectMany(s => s.Values.Where(v => v.Value.HasValue).Select(p => Convert.ToDouble(p.Value.Value)));
                if (a.Any())
                {
                    switch (pointToSet)
                    {
                        case PointToSet.Min:
                            var min = Math.Floor(a.Min());
                            if (min < chart.Yaxis.Start)
                            {
                                chart.Yaxis.Start = min;
                            }
                            break;
                        case PointToSet.Max:
                            var max = Math.Ceiling(a.Max());
                            if (max > chart.Yaxis.End)
                            {
                                chart.Yaxis.End = max;
                            }
                            break;
                    }
                }
            }
        }

        private SingleChart CreateChart(GetChartInfo_Result chartInfo)
        {
            return new SingleChart
            {
                Title = chartInfo.ChartTitle,
                Description = chartInfo.ChartDescription,
                SourceLink = chartInfo.ChartSourceLink,
                SourceTitle = chartInfo.ChartSourceTitle,
                Xaxis = new Xaxis { Categories = new List<string>() },
                Yaxis = new Yaxis { Title = chartInfo.ChartYaxisTitle, ValueSuffix = chartInfo.ChartValueSuffix },
                //Tooltip = new Tooltip { ValueSuffix = chartInfo.ChartValueSuffix },
                Series = new List<ChartSeries>(),
                Note = chartInfo.ChartNote
            };
        }

        private static void InitChartData(string id, string countryCode, string yearConfig, bool addComparedCountries,
            bool addRegion, bool addIncomeRegion, out DatabaseRepository db, out IList<GetValuesResult> data,
            out IList<int> years, out int requestedCountryId, out List<GetIndicatorsInfoResult> indicatorList,
            out List<GetCountriesInfo_Result> countryList,
            out List<GetSupportedIndicatorsResult> supportedIndicatorsList,
            out Dictionary<string, Dictionary<string, List<string>>> config)
        {
            Dictionary<int, IList<int>> yearsPerIndicator;
            InitChartData(id, countryCode, yearConfig, addComparedCountries, addRegion, addIncomeRegion, false, out db, out data, out years, out requestedCountryId, out indicatorList, out countryList, out supportedIndicatorsList, out config, out yearsPerIndicator);
        }

        private static void InitChartData(string id, string countryCode, string yearConfig, bool addComparedCountries,
            bool addRegion, bool addIncomeRegion, bool addWorld, out DatabaseRepository db, out IList<GetValuesResult> data,
            out IList<int> years, out int requestedCountryId, out List<GetIndicatorsInfoResult> indicatorList,
            out List<GetCountriesInfo_Result> countryList,
            out List<GetSupportedIndicatorsResult> supportedIndicatorsList,
            out Dictionary<string, Dictionary<string, List<string>>> config,
            bool limitYearsByRequestedCountry = true)
        {
            Dictionary<int, IList<int>> yearsPerIndicator;
            InitChartData(id, countryCode, yearConfig, addComparedCountries, addRegion, addIncomeRegion, addWorld,
                out db, out data, out years, out requestedCountryId, out indicatorList, out countryList,
                out supportedIndicatorsList, out config, out yearsPerIndicator, limitYearsByRequestedCountry);
        }

        private static void InitChartData(string id, string countryCode, string yearConfig, bool addComparedCountries,
            bool addRegion, bool addIncomeRegion, bool addWorld, out DatabaseRepository db,
            out IList<GetValuesResult> data,
            out IList<int> years, out int requestedCountryId, out List<GetIndicatorsInfoResult> indicatorList,
            out List<GetCountriesInfo_Result> countryList,
            out List<GetSupportedIndicatorsResult> supportedIndicatorsList,
            out Dictionary<string, Dictionary<string, List<string>>> config,
            out Dictionary<int, IList<int>> yearsPerIndicator,
            bool limitYearsByRequestedCountry = true,
            bool clearIfNoRequestedCountryData = true)
        {
            years = new List<int>();
            yearsPerIndicator = new Dictionary<int, IList<int>>();
            config = ChartConfigParser.GetChartConfig(id);

            db = new DatabaseRepository();


            var countryInfoList = db.GetCountriesInfo(countryCode);
            countryList = countryInfoList.ToList();
            var requestedCountryInfo = countryInfoList.First(c => c.CountryType == 0);
            var incomeInsteadOfRegion = requestedCountryInfo.IncomeId == 3 || requestedCountryInfo.IncomeId == 5;
            requestedCountryId = requestedCountryInfo.CountryId;
            var countryIds = new List<int> { requestedCountryId };
            if (addComparedCountries)
            {
                var comparedCountries =
                    countryInfoList.Where(c => c.CountryType == 1).Select(c => c.CountryId).Distinct();
                countryIds.AddRange(comparedCountries);
            }

            if (addRegion)
            {
                var regionData = config.GetValue("RegionData");
                var regionId = requestedCountryInfo.GetRegionId(regionData, isHighIncome: incomeInsteadOfRegion);
                if (regionId.HasValue)
                {
                    countryIds.Add(regionId.Value);
                }
            }
            if (addIncomeRegion)
            {
                if (!incomeInsteadOfRegion)
                {
                    var regionData = config.GetValue("IncomeData");
                    var regionId = requestedCountryInfo.GetRegionId(regionData, true);
                    if (regionId.HasValue)
                    {
                        countryIds.Add(regionId.Value);
                    }
                }
            }
            if (addWorld)
            {
                var regionData = config.GetValue("WorldData");
                var regionId = requestedCountryInfo.GetRegionId(regionData, isWorldRegion: true);
                if (regionId.HasValue)
                {
                    countryIds.Add(regionId.Value);
                }
            }

            var indicators = config.GetValues("IndicatorName", "Indicators");
            indicatorList =
                db.GetIndicatorsInfo(indicators)
                    .OrderBy(i => i.IndicatorName, new IndicatorComparer(indicators))
                    .ToList();
            supportedIndicatorsList =
                db.GetSupportedIndicators(
                    indicatorList.Where(i => !i.IsSupportedIndicator).Select(i => i.IndicatorId).ToList()).ToList();


            data = db.GetValues(indicatorList.Select(i => i.IndicatorId).ToList(), countryIds);
            if (data.Count > 0)
            {
                Func<GetValuesResult, bool> filterByYear = v => true;
                if (limitYearsByRequestedCountry)
                {
                    filterByYear = v => v.CountryId == requestedCountryInfo.CountryId;
                }
                var dbYears =
                    data.Where(filterByYear)
                        .Select(v => v.Year)
                        .OrderBy(y => y)
                        .Distinct()
                        .ToList();
                if (dbYears.Count == 0)
                {
                    dbYears = data.Select(v => v.Year).OrderBy(y => y).Distinct().ToList();
                }
                yearConfig = yearConfig ?? config.GetValue("Years");
                if (config.GetValue("ParseYear") == "PerIndicator")
                {
                    var lYears = new List<int>();
                    var groups =
                        data.Where(i => i.CountryId == requestedCountryInfo.CountryId).GroupBy(i => i.IndicatorId);
                    foreach (var g in groups)
                    {

                        var range = Utilities.ParseYears(yearConfig, g.Select(i => i.Year).ToList());
                        yearsPerIndicator.Add(g.Key, range.Distinct().ToList());
                        lYears.AddRange(range);
                    }
                    years = lYears.Distinct().OrderBy(y => y).ToList();
                }
                else if (config.GetValue("ParseYear") == "PerCountry")
                {
                    var dYears = new List<int>();
                    foreach (var countryId in countryIds)
                    {
                        var lYears = data.Where(d => d.CountryId == countryId).ToList();
                        if (lYears.Any())
                        {
                            var aYears = lYears.Select(d => d.Year).Distinct().ToList();
                            dYears.AddRange(Utilities.ParseYears(yearConfig, aYears));
                        }
                        
                    }

                    years = dYears.Distinct().ToList();
                }
                else
                {
                    years = Utilities.ParseYears(yearConfig, dbYears);
                }


                var localYears = years;
                data =
                    data.Where(d => localYears.Contains(d.Year))
                        .OrderBy(d => d.Year)
                        .ThenBy(d => d.IndicatorId, new IdComparer(indicatorList.Select(i => i.IndicatorId)))
                        .ToList();

                if (data.All(d => d.CountryId != requestedCountryInfo.CountryId) && clearIfNoRequestedCountryData)
                {
                    data.Clear();
                }
            }
            //indicators = data.Select(i => i.IndicatorAlias ?? i.IndicatorName).Distinct().ToList();

        }

        private void ConvertToSeries(IEnumerable<GetValuesResult> data,
            IList<int> categoryIds, Dictionary<int, string> categoryDictionary, Func<GetValuesResult, int> seriesGroupFunc,
            SeriesType serieType, Dictionary<int, string> seriesDictionary,
            Func<GetValuesResult, int> convertFunc, Func<decimal?, Point> createNewPointFunc, out List<string> categories, out List<ChartSeries> series)
        {
            if (categoryDictionary == null) throw new ArgumentNullException("categoryDictionary");
            series = new List<ChartSeries>();

            categories = categoryIds.Select(categoryId => categoryDictionary[categoryId]).ToList();

            var groups = data.GroupBy(seriesGroupFunc);
            foreach (var g in groups)
            {
                var dict = g.ToDictionary(d => new Tuple<int, int>(g.Key, convertFunc(d)));
                var serie = new ChartSeries { Name = seriesDictionary[g.Key], Id = g.Key, SeriesType = serieType, Values = new List<Point>()};
                foreach (var categoryId in categoryIds)
                {
                    var key = new Tuple<int, int>(g.Key, categoryId);
                    GetValuesResult value;
                    if (dict.TryGetValue(key, out value))
                    {
                        serie.Values.Add(createNewPointFunc(value.IndicatorValue));
                    }
                    else
                    {
                        serie.Values.Add(createNewPointFunc(null));
                    }
                }
                series.Add(serie);
            }
        }

        private MultiChart CreateMultiChart(
            String chart1Id, SingleChart chart1, double[] referenceLines1,
            String chart2Id, SingleChart chart2, double[] referenceLines2
        )
        {
            var cats = chart1.Xaxis.Categories.Union(chart2.Xaxis.Categories).Distinct().ToList();

            Func<SingleChart, List<ChartSeries>> func = (ch) =>
            {
                var series = new List<ChartSeries>();
                foreach (var s in ch.Series)
                {
                    var valueDictionary =
                        ch.Xaxis.Categories.Select((c, i) => new KeyValuePair<string, Point>(c, s.Values[i]))
                            .ToDictionary(k => k.Key, k => k.Value);
                    var newSeries = new ChartSeries
                    {
                        Name = s.Name,
                        SeriesType = s.SeriesType,
                        SerieCountryType = s.SerieCountryType,
                        Values = new List<Point>()
                    };
                    foreach (var cat in cats)
                    {
                        if (valueDictionary.ContainsKey(cat))
                        {
                            newSeries.Values.Add(valueDictionary[cat]);
                        }
                        else
                        {
                            var constr = s.Values.First().GetType().GetConstructor(new Type[] { });
                            newSeries.Values.Add((Point)constr.Invoke(new object[] { }));
                        }
                    }

                    series.Add(newSeries);
                }

                return series;
            };

            var result = new MultiChart
            {
                Title = chart1.Title,
                Description = chart1.Description,
                SourceTitle = chart1.SourceTitle,
                SourceLink = chart1.SourceLink,
                Note = chart1.Note,
                AreValuesInversed = chart1.AreValuesInversed,
                TableIndicatorColumn = chart1.TableIndicatorColumn,
                TableUnitLabel = chart1.TableUnitLabel,
                SeriesGroups = new [] {
                    new SeriesGroup {
                        ChartId = chart1Id,
                        Xaxis = chart1.Xaxis,
                        Yaxis = chart1.Yaxis,
                        ReferenceLines = referenceLines1,
                        //Tooltip = chart1.Tooltip,
                        Series = func(chart1)
                    },
                    new SeriesGroup {
                        ChartId = chart2Id,
                        Xaxis = chart2.Xaxis,
                        Yaxis = chart2.Yaxis,
                        ReferenceLines = referenceLines2,
                        //Tooltip = chart2.Tooltip,
                        Series = func(chart2)
                    }
                }.ToList(),
                Categories = cats
            };
            return result;
        }

        private SerieCountryType getSerieCountryType(int id, Dictionary<int, GetCountriesInfo_Result> countries)
        {
            var result = SerieCountryType.NotCountry;
            if (countries.ContainsKey(id))
            {
                var c = countries[id];
                switch (c.CountryType)
                {
                    case 0:
                        result = SerieCountryType.Country;
                        break;
                    case 1:
                        result = SerieCountryType.Comparator;
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        result = SerieCountryType.Region;
                        break;
                    case 9:
                    case 10:
                        result = SerieCountryType.World;
                        break;
                }
            }

            return result;
        }
    }
}
