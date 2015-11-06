use BES_2008;
go

update chart 
set TableUnitLabel = NULL
where chartid = 'ElectricityOutages' or chartid = 'DistanceToFrontierByIndicator' or chartid = 'ManagementTimeSpentWithRequirementsOfRegulation'

go