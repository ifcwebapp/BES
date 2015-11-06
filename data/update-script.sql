use BES_2008;
go

update Indicator
set IndicatorAlias = 'Strength of legal rights index (0-12)'
where IndicatorId = 63;

update Indicator
set IndicatorAlias = 'Depth of credit information index (0-8)'
where IndicatorId = 64;

update Indicator
set IndicatorAlias = 'Commencement of proceedings index (0-3)'
where IndicatorId = 111;

update Indicator
set IndicatorAlias = 'Management of debtor''s assets index (0-6)'
where IndicatorId = 112;

update Indicator
set IndicatorAlias = 'Reorganization proceedings index (0-3)'
where IndicatorId = 113;

update Indicator
set IndicatorAlias = 'Creditor participation index (0-4)'
where IndicatorId = 114;

update Indicator
set IndicatorAlias = 'Strength of insolvency framework index (0-16)'
where IndicatorId = 115;

update Indicator
set IndicatorAlias = 'Website quality (0-100)'
where IndicatorId = 1879;

update Indicator
set IndicatorAlias = 'Inquiry handling (0-100)'
where IndicatorId = 1880;
go

ALTER TABLE dbo.Chart ADD
	TableUnitLabel varchar(150) NULL,
	TableIndicatorColumn varchar(150) NULL
GO

update Chart set TableUnitLabel = 'Distance to Frontier (100 = Global best practice)', TableIndicatorColumn = '' where ChartId = 'DoingBusinessIndicators'
update Chart set TableUnitLabel = 'Distance to Frontier Progress; Reform count', TableIndicatorColumn = '' where ChartId = 'DistanceToFrontierByIndicator'
update Chart set TableUnitLabel = 'Global Competitiveness Index (7 = best)', TableIndicatorColumn = '' where ChartId = 'GlobalCompetitivenessIndex'
update Chart set TableUnitLabel = 'Global Competitiveness Index (7 = best)', TableIndicatorColumn = '' where ChartId = 'GlobalCompetitivenessPillars'
update Chart set TableUnitLabel = 'Percent of firms', TableIndicatorColumn = 'Obstacle', ChartTitleYearSuffix = null where ChartId = 'EnterpriseSurveysTopObstacles'
update Chart set TableUnitLabel = 'Percent of responses (weighted)', TableIndicatorColumn = 'Problematic factor' where ChartId = 'MostProblematicFactors'
update Chart set TableUnitLabel = 'Percent of investors', TableIndicatorColumn = 'Constraint' where ChartId = 'BiggestRegionalConstraintToFutureInvestment'
update Chart set TableUnitLabel = 'Governance index performance (0 = average)', TableIndicatorColumn = '' where ChartId = 'WorldwideGovernanceIndicators'
update Chart set TableUnitLabel = 'Governance index performance (0 = average)', TableIndicatorColumn = '' where ChartId = 'ControlOfCorruption'
update Chart set TableUnitLabel = 'Percent of firms', TableIndicatorColumn = 'Reason for bribe' where ChartId = 'FirmsExpectedToPayBribes'
update Chart set TableUnitLabel = 'Governance index performance (0 = average)', TableIndicatorColumn = '' where ChartId = 'RegulatoryQuality'
update Chart set TableUnitLabel = 'Percent of time', TableIndicatorColumn = '' where ChartId = 'ManagementTimeSpentWithRequirementsOfRegulation'
update Chart set TableUnitLabel = 'Number of days', TableIndicatorColumn = '' where ChartId = 'ContractEnforcementTime'
update Chart set TableUnitLabel = 'Index score (100 = max)', TableIndicatorColumn = '' where ChartId = 'ArbitratingCommercialDisputes'
update Chart set TableUnitLabel = 'Cents on the dollar', TableIndicatorColumn = '' where ChartId = 'InsolvencyRecoveryRate'
update Chart set TableUnitLabel = 'Index score', TableIndicatorColumn = '' where ChartId = 'StrengthOfInsolvencyFrameworkIndices'
update Chart set TableUnitLabel = 'Percent of income per capita', TableIndicatorColumn = '' where ChartId = 'StartingBusiness'
update Chart set TableUnitLabel = 'Newly registered firms per 1,000 adults', TableIndicatorColumn = '' where ChartId = 'NewFirmRegistrationRate'
update Chart set TableUnitLabel = 'Number of days', TableIndicatorColumn = '' where ChartId = 'ConstructionPermittingTime'
update Chart set TableUnitLabel = 'Percent of property value', TableIndicatorColumn = '' where ChartId = 'CostOfRegisteringProperty'
update Chart set TableUnitLabel = 'Index score', TableIndicatorColumn = '' where ChartId = 'GettingCreditIndices'
update Chart set TableUnitLabel = 'Index score', TableIndicatorColumn = '' where ChartId = 'ProtectingMinorityInvestorsIndices'
update Chart set TableUnitLabel = '% of GDP', TableIndicatorColumn = '' where ChartId = 'CreditToPrivateSector'
update Chart set TableUnitLabel = 'Interest rate', TableIndicatorColumn = '' where ChartId = 'LendingVsDepositInterestRates'
update Chart set TableUnitLabel = 'Index score (200 = combined max)', TableIndicatorColumn = '' where ChartId = 'BestPracticesForInvestmentPromotion'
update Chart set TableUnitLabel = 'Percent of investors', TableIndicatorColumn = 'Investor reaction' where ChartId = 'ReportedRegionalInvestmentChanges'
update Chart set TableUnitLabel = 'Maximum foreign ownership share permitted', TableIndicatorColumn = '' where ChartId = 'ForeignEquityOwnershipAllowed'
update Chart set TableUnitLabel = 'Index score (100 = max)', TableIndicatorColumn = '' where ChartId = 'StartingForeignBusinessEaseEstablishmentIndex'
update Chart set TableUnitLabel = 'Number of procedures', TableIndicatorColumn = '' where ChartId = 'StartingForeignBusinessNumberOfProcedures'
update Chart set TableUnitLabel = 'Number of days', TableIndicatorColumn = '' where ChartId = 'StartingForeignBusinessTimeToStart'
update Chart set TableUnitLabel = 'Index score (100 = max)', TableIndicatorColumn = '' where ChartId = 'AccessingIndustrialLand'
update Chart set TableUnitLabel = 'Number of days', TableIndicatorColumn = '' where ChartId = 'GettingElectricity'
update Chart set TableUnitLabel = 'Percent of population', TableIndicatorColumn = '' where ChartId = 'ElectricityAccess'
update Chart set TableUnitLabel = 'kWh per capita', TableIndicatorColumn = '' where ChartId = 'ElectricityConsumption'
update Chart set TableUnitLabel = 'NULL', TableIndicatorColumn = '' where ChartId = 'ElectricityOutages'
update Chart set TableUnitLabel = 'US$ per container', TableIndicatorColumn = '' where ChartId = 'CostToImportAndExport'
update Chart set TableUnitLabel = 'Trade (% of GDP)', TableIndicatorColumn = '' where ChartId = 'OpennessToTrade'
update Chart set TableUnitLabel = 'Index score (5 = max)', TableIndicatorColumn = '' where ChartId = 'LogisticsPerformanceIndex'
update Chart set TableUnitLabel = 'Percentage of commercial profits', TableIndicatorColumn = '' where ChartId = 'PayingTaxesRates'
update Chart set TableUnitLabel = 'Hours per year', TableIndicatorColumn = '' where ChartId = 'PayingTaxesHoursPerYear'
go

update chart 
set ChartDescription = 'measures the availability of electrical power by households and businesses'
where chartid = 'ElectricityAccess'

update chart 
set ChartDescription = 'measures the use of electrical power by households and businesses'
where chartid = 'ElectricityConsumption'

update indicator
set IndicatorAlias = 'Website quality (0%-100%)'
where IndicatorId = 1879

update indicator
set IndicatorAlias = 'Inquiry handling (0%-100%)'
where IndicatorId = 1880
go

update chart 
set TableUnitLabel = NULL
where chartid = 'ElectricityOutages' or chartid = 'DistanceToFrontierByIndicator' or chartid = 'ManagementTimeSpentWithRequirementsOfRegulation'

go









