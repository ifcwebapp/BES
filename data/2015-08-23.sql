use BES_2008;
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