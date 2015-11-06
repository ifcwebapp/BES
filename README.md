# business-environment-snapshots


### Installation

1. Install node.js
2. Run `npm install bower -g`
3. ~~Run `npm install tsd -g`~~
4. Run `npm install grunt -g`
5. Run `npm install grunt-cli -g`
6. From the root repository folder go to `BusinessEnvironmentSnapshots/BusinessEnvironmentSnapshots.UI` 
7. Run `npm install`
8. Run `bower install`
9. ~~Run `tsd reinstall --save`~~
10. Build and run the project in Visual Studio


### TypeScript

The client code written in TypeScript 1.6 which is yet to be released.

You need to:
- Make sure you have TypeScript 1.5.3  installed: https://visualstudiogallery.msdn.microsoft.com/b1fff87e-d68b-4266-8bba-46fad76bbf22
- Then
  - either
    - Clone typscript repository from https://github.com/Microsoft/TypeScript.git
    - Follow the instructions from https://github.com/Microsoft/TypeScript on how to build a local version (jake local)
    - Make sure you have `tsc.js` and `typescriptServices.js` in the `built/local` folder of the repository
  - or
    - Get compiled JavaScript files from https://app.box.com/files/0/f/3338689128/1/f_34630741403
    - Extract `tsc.js` and `typescriptServices.js` from the downloaded zip file
- Make a backup copy of `C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\tsc.js`
- Copy `tsc.js` to `C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\`
- Make a backup copy of `C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE\CommonExtensions\Microsoft\TypeScript\typescriptServices.js`
- Copy `typescriptServices.js` from the repository folder to `C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\IDE\CommonExtensions\Microsoft\TypeScript\`


### Database
1. Download database from https://wbg.box.com/s/ku7ulophk7ww4nsitnox1ca3ue340qsk
2. Unzip and put the file to BusinessEnvironmentSnapshots/BusinessEnvironmentSnapshots.Service/App_Data
3. Run the project in Visual Studio

### Chart API

Service API - api/chart?id={chartId}&countryCode={countryCode}&years=[list of years]

countryCode and id are required parameters, years is optional

Use country code KEN for tests

Available chart Ids:
* DistanceToFrontierByIndicator
* GlobalCompetitivenessIndex
* GlobalCompetitivenessPillars
* OverallDistanceToFrontier
* EnterpriseSurveysTopObstacles
* BiggestRegionalConstraintToFutureInvestment
* WorldwideGovernanceIndicators
* FirmsExpectedToPayBribes
* ControlOfCorruption
* ArbitratingCommercialDisputes
* ContractEnforcementTime
* ProtectingMinorityInvestorsIndices
* RegulatoryQuality
* ManagementTimeSpentWithRequirementsOfRegulation
* NewFirmRegistrationRate
* StartingBusiness
* ConstructionPermittingTime
* CostOfRegisteringProperty
* ReportedRegionalInvestmentChanges
* OpennessToTrade

Format of year list:
year[-year][,year] where year is integer or string.
Acceptable string values: MostRecent, LastRecent

