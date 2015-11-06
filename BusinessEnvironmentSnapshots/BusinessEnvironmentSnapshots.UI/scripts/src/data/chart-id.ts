import ec = require('essentials/core');

export interface ViaChartId<r> {
    caseOfDistanceToFrontierByIndicator                  (chartId: string): r;
    caseOfEnterpriseSurveysTopObstacles                  (chartId: string): r;
    caseOfGlobalCompetitivenessIndex                     (chartId: string): r;
    caseOfGlobalCompetitivenessPillars                   (chartId: string): r;
    caseOfOverallDistanceToFrontier                      (chartId: string): r;
    caseOfWorldwideGovernanceIndicators                  (chartId: string): r;
    caseOfOpennessToTrade                                (chartId: string): r;
    caseOfBiggestRegionalConstraintToFutureInvestment    (chartId: string): r;
    caseOfReportedRegionalInvestmentChanges              (chartId: string): r;
    caseOfControlOfCorruption                            (chartId: string): r;
    caseOfFirmsExpectedToPayBribes                       (chartId: string): r;
    caseOfContractEnforcementTime                        (chartId: string): r;
    caseOfProtectingMinorityInvestorsIndices             (chartId: string): r;
    caseOfArbitratingCommercialDisputes                  (chartId: string): r;
    caseOfRegulatoryQuality                              (chartId: string): r;
    caseOfManagementTimeSpentWithRequirementsOfRegulation(chartId: string): r;
    caseOfNewFirmRegistrationRate                        (chartId: string): r;
    caseOfStartingBusiness                               (chartId: string): r;
    caseOfConstructionPermittingTime                     (chartId: string): r;
    caseOfCostOfRegisteringProperty                      (chartId: string): r;
    caseOfCreditToPrivateSector                          (chartId: string): r;
    caseOfGettingCreditIndices                           (chartId: string): r;
    caseOfLendingVsDepositInterestRates                  (chartId: string): r;
    caseOfPublicAndPrivateCreditCoverage                 (chartId: string): r;
    caseOfInsolvencyRecoveryRate                         (chartId: string): r;
    caseOfStrengthOfInsolvencyFrameworkIndices           (chartId: string): r;
    caseOfBestPracticesForInvestmentPromotion            (chartId: string): r;
    caseOfForeignEquityOwnershipAllowed                  (chartId: string): r;
    caseOfStartingForeignBusinessEaseEstablishmentIndex  (chartId: string): r;
    caseOfStartingForeignBusinessTimeToStart             (chartId: string): r;
    caseOfStartingForeignBusinessNumberOfProcedures      (chartId: string): r;
    caseOfAccessingIndustrialLand                        (chartId: string): r;
    caseOfGettingElectricity                             (chartId: string): r;
    caseOfElectricityAccess                              (chartId: string): r;
    caseOfElectricityConsumption                         (chartId: string): r;
    caseOfElectricityOutages                             (chartId: string): r;
    caseOfCostToImportAndExport                          (chartId: string): r;
    caseOfLogisticsPerformanceIndex                      (chartId: string): r;
    caseOfPayingTaxesHoursPerYear                        (chartId: string): r;
    caseOfPayingTaxesRates                               (chartId: string): r;
    caseOfMostProblematicFactors                         (chartId: string): r;
    caseOfDoingBusinessIndicators                        (chartId: string): r;
    caseOfDoingBusinessRanking                           (chartId: string): r;
    caseOfReformsValidatedByDoingBusiness                (chartId: string): r;
}

export function toViaChartId<r>(caseOf: (chartId: string) => r) : ViaChartId<r> {
    return {
        caseOfDistanceToFrontierByIndicator                  : caseOf,
        caseOfEnterpriseSurveysTopObstacles                  : caseOf,
        caseOfGlobalCompetitivenessIndex                     : caseOf,
        caseOfGlobalCompetitivenessPillars                   : caseOf,
        caseOfOverallDistanceToFrontier                      : caseOf,
        caseOfWorldwideGovernanceIndicators                  : caseOf,
        caseOfOpennessToTrade                                : caseOf,
        caseOfBiggestRegionalConstraintToFutureInvestment    : caseOf,
        caseOfReportedRegionalInvestmentChanges              : caseOf,
        caseOfControlOfCorruption                            : caseOf,
        caseOfFirmsExpectedToPayBribes                       : caseOf,
        caseOfContractEnforcementTime                        : caseOf,
        caseOfProtectingMinorityInvestorsIndices             : caseOf,
        caseOfArbitratingCommercialDisputes                  : caseOf,
        caseOfRegulatoryQuality                              : caseOf,
        caseOfManagementTimeSpentWithRequirementsOfRegulation: caseOf,
        caseOfNewFirmRegistrationRate                        : caseOf,
        caseOfStartingBusiness                               : caseOf,
        caseOfConstructionPermittingTime                     : caseOf,
        caseOfCostOfRegisteringProperty                      : caseOf,
        caseOfCreditToPrivateSector                          : caseOf,
        caseOfGettingCreditIndices                           : caseOf,
        caseOfLendingVsDepositInterestRates                  : caseOf,
        caseOfPublicAndPrivateCreditCoverage                 : caseOf,
        caseOfInsolvencyRecoveryRate                         : caseOf,
        caseOfStrengthOfInsolvencyFrameworkIndices           : caseOf,
        caseOfBestPracticesForInvestmentPromotion            : caseOf,
        caseOfForeignEquityOwnershipAllowed                  : caseOf,
        caseOfStartingForeignBusinessEaseEstablishmentIndex  : caseOf,
        caseOfStartingForeignBusinessTimeToStart             : caseOf,
        caseOfStartingForeignBusinessNumberOfProcedures      : caseOf,
        caseOfAccessingIndustrialLand                        : caseOf,
        caseOfGettingElectricity                             : caseOf,
        caseOfElectricityAccess                              : caseOf,
        caseOfElectricityConsumption                         : caseOf,
        caseOfElectricityOutages                             : caseOf,
        caseOfCostToImportAndExport                          : caseOf,
        caseOfLogisticsPerformanceIndex                      : caseOf,
        caseOfPayingTaxesHoursPerYear                        : caseOf,
        caseOfPayingTaxesRates                               : caseOf,
        caseOfMostProblematicFactors                         : caseOf,
        caseOfDoingBusinessIndicators                        : caseOf,
        caseOfDoingBusinessRanking                           : caseOf,
        caseOfReformsValidatedByDoingBusiness                : caseOf
    };
}

export function viaChartId<r>(chartId: string, via: ViaChartId<r>) : r {
    switch (chartId) {
        case 'OverallDistanceToFrontier'                      : return via.caseOfOverallDistanceToFrontier                      (chartId);
        case 'DistanceToFrontierByIndicator'                  : return via.caseOfDistanceToFrontierByIndicator                  (chartId);
        case 'GlobalCompetitivenessIndex'                     : return via.caseOfGlobalCompetitivenessIndex                     (chartId);
        case 'GlobalCompetitivenessPillars'                   : return via.caseOfGlobalCompetitivenessPillars                   (chartId);
        case 'EnterpriseSurveysTopObstacles'                  : return via.caseOfEnterpriseSurveysTopObstacles                  (chartId);
        case 'WorldwideGovernanceIndicators'                  : return via.caseOfWorldwideGovernanceIndicators                  (chartId);
        case 'BiggestRegionalConstraintToFutureInvestment'    : return via.caseOfBiggestRegionalConstraintToFutureInvestment    (chartId);
        case 'OpennessToTrade'                                : return via.caseOfOpennessToTrade                                (chartId);
        case 'ReportedRegionalInvestmentChanges'              : return via.caseOfReportedRegionalInvestmentChanges              (chartId);
        case 'ControlOfCorruption'                            : return via.caseOfControlOfCorruption                            (chartId);
        case 'FirmsExpectedToPayBribes'                       : return via.caseOfFirmsExpectedToPayBribes                       (chartId);
        case 'ContractEnforcementTime'                        : return via.caseOfContractEnforcementTime                        (chartId);
        case 'ProtectingMinorityInvestorsIndices'             : return via.caseOfProtectingMinorityInvestorsIndices             (chartId);
        case 'ArbitratingCommercialDisputes'                  : return via.caseOfArbitratingCommercialDisputes                  (chartId);
        case 'RegulatoryQuality'                              : return via.caseOfRegulatoryQuality                              (chartId);
        case 'ManagementTimeSpentWithRequirementsOfRegulation': return via.caseOfManagementTimeSpentWithRequirementsOfRegulation(chartId);
        case 'NewFirmRegistrationRate'                        : return via.caseOfNewFirmRegistrationRate                        (chartId);
        case 'StartingBusiness'                               : return via.caseOfStartingBusiness                               (chartId);
        case 'ConstructionPermittingTime'                     : return via.caseOfConstructionPermittingTime                     (chartId);
        case 'CostOfRegisteringProperty'                      : return via.caseOfCostOfRegisteringProperty                      (chartId);
        case 'CreditToPrivateSector'                          : return via.caseOfCreditToPrivateSector                          (chartId);
        case 'GettingCreditIndices'                           : return via.caseOfGettingCreditIndices                           (chartId);
        case 'LendingVsDepositInterestRates'                  : return via.caseOfLendingVsDepositInterestRates                  (chartId);
        case 'PublicAndPrivateCreditCoverage'                 : return via.caseOfPublicAndPrivateCreditCoverage                 (chartId);
        case 'InsolvencyRecoveryRate'                         : return via.caseOfInsolvencyRecoveryRate                         (chartId);
        case 'StrengthOfInsolvencyFrameworkIndices'           : return via.caseOfStrengthOfInsolvencyFrameworkIndices           (chartId);
        case 'BestPracticesForInvestmentPromotion'            : return via.caseOfBestPracticesForInvestmentPromotion            (chartId);
        case 'ForeignEquityOwnershipAllowed'                  : return via.caseOfForeignEquityOwnershipAllowed                  (chartId);
        case 'StartingForeignBusinessEaseEstablishmentIndex'  : return via.caseOfStartingForeignBusinessEaseEstablishmentIndex  (chartId);
        case 'StartingForeignBusinessTimeToStart'             : return via.caseOfStartingForeignBusinessTimeToStart             (chartId);
        case 'StartingForeignBusinessNumberOfProcedures'      : return via.caseOfStartingForeignBusinessNumberOfProcedures      (chartId);
        case 'AccessingIndustrialLand'                        : return via.caseOfAccessingIndustrialLand                        (chartId);
        case 'GettingElectricity'                             : return via.caseOfGettingElectricity                             (chartId);
        case 'ElectricityAccess'                              : return via.caseOfElectricityAccess                              (chartId);
        case 'ElectricityConsumption'                         : return via.caseOfElectricityConsumption                         (chartId);
        case 'ElectricityOutages'                             : return via.caseOfElectricityOutages                             (chartId);
        case 'CostToImportAndExport'                          : return via.caseOfCostToImportAndExport                          (chartId);
        case 'LogisticsPerformanceIndex'                      : return via.caseOfLogisticsPerformanceIndex                      (chartId);
        case 'PayingTaxesHoursPerYear'                        : return via.caseOfPayingTaxesHoursPerYear                        (chartId);
        case 'PayingTaxesRates'                               : return via.caseOfPayingTaxesRates                               (chartId);
        case 'MostProblematicFactors'                         : return via.caseOfMostProblematicFactors                         (chartId);
        case 'DoingBusinessRanking'                           : return via.caseOfDoingBusinessRanking                           (chartId);
        case 'DoingBusinessIndicators'                        : return via.caseOfDoingBusinessIndicators                        (chartId);
        case 'ReformsValidatedByDoingBusiness'                : return via.caseOfReformsValidatedByDoingBusiness                (chartId);
        
        default: return ec.fail<r>('Unexpected case \'' + chartId + '\' of a chart ID.');
    }
}

export interface ForChartId<r> {
    forDistanceToFrontierByIndicator                  : r;
    forEnterpriseSurveysTopObstacles                  : r;
    forGlobalCompetitivenessIndex                     : r;
    forGlobalCompetitivenessPillars                   : r;
    forOverallDistanceToFrontier                      : r;
    forWorldwideGovernanceIndicators                  : r;
    forOpennessToTrade                                : r;
    forBiggestRegionalConstraintToFutureInvestment    : r;
    forReportedRegionalInvestmentChanges              : r;
    forControlOfCorruption                            : r;
    forFirmsExpectedToPayBribes                       : r;
    forContractEnforcementTime                        : r;
    forProtectingMinorityInvestorsIndices             : r;
    forArbitratingCommercialDisputes                  : r;
    forRegulatoryQuality                              : r;
    forManagementTimeSpentWithRequirementsOfRegulation: r;
    forNewFirmRegistrationRate                        : r;
    forStartingBusiness                               : r;
    forConstructionPermittingTime                     : r;
    forCostOfRegisteringProperty                      : r;
    forCreditToPrivateSector                          : r;
    forGettingCreditIndices                           : r;
    forLendingVsDepositInterestRates                  : r;
    forPublicAndPrivateCreditCoverage                 : r;
    forInsolvencyRecoveryRate                         : r;
    forStrengthOfInsolvencyFrameworkIndices           : r;
    forBestPracticesForInvestmentPromotion            : r;
    forForeignEquityOwnershipAllowed                  : r;
    forStartingForeignBusinessEaseEstablishmentIndex  : r;
    forStartingForeignBusinessTimeToStart             : r;
    forStartingForeignBusinessNumberOfProcedures      : r;
    forAccessingIndustrialLand                        : r;
    forGettingElectricity                             : r;
    forElectricityAccess                              : r;
    forElectricityConsumption                         : r;
    forElectricityOutages                             : r;
    forCostToImportAndExport                          : r;
    forLogisticsPerformanceIndex                      : r;
    forPayingTaxesHoursPerYear                        : r;
    forPayingTaxesRates                               : r;
    forMostProblematicFactors                         : r;
    forDoingBusinessRanking                           : r;
    forDoingBusinessIndicators                        : r;
    forReformsValidatedByDoingBusiness                : r;
}

export function toForChartId<r>(result: r) : ForChartId<r> {
    return {
        forDistanceToFrontierByIndicator                  : result,
        forEnterpriseSurveysTopObstacles                  : result,
        forGlobalCompetitivenessIndex                     : result,
        forGlobalCompetitivenessPillars                   : result,
        forOverallDistanceToFrontier                      : result,
        forWorldwideGovernanceIndicators                  : result,
        forOpennessToTrade                                : result,
        forBiggestRegionalConstraintToFutureInvestment    : result,
        forReportedRegionalInvestmentChanges              : result,
        forControlOfCorruption                            : result,
        forFirmsExpectedToPayBribes                       : result,
        forContractEnforcementTime                        : result,
        forProtectingMinorityInvestorsIndices             : result,
        forArbitratingCommercialDisputes                  : result,
        forRegulatoryQuality                              : result,
        forManagementTimeSpentWithRequirementsOfRegulation: result,
        forNewFirmRegistrationRate                        : result,
        forStartingBusiness                               : result,
        forConstructionPermittingTime                     : result,
        forCostOfRegisteringProperty                      : result,
        forCreditToPrivateSector                          : result,
        forGettingCreditIndices                           : result,
        forLendingVsDepositInterestRates                  : result,
        forPublicAndPrivateCreditCoverage                 : result,
        forInsolvencyRecoveryRate                         : result,
        forStrengthOfInsolvencyFrameworkIndices           : result,
        forBestPracticesForInvestmentPromotion            : result,
        forForeignEquityOwnershipAllowed                  : result,
        forStartingForeignBusinessEaseEstablishmentIndex  : result,
        forStartingForeignBusinessTimeToStart             : result,
        forStartingForeignBusinessNumberOfProcedures      : result,
        forAccessingIndustrialLand                        : result,
        forGettingElectricity                             : result,
        forElectricityAccess                              : result,
        forElectricityConsumption                         : result,
        forElectricityOutages                             : result,
        forCostToImportAndExport                          : result,
        forLogisticsPerformanceIndex                      : result,
        forPayingTaxesHoursPerYear                        : result,
        forPayingTaxesRates                               : result,
        forMostProblematicFactors                         : result,
        forDoingBusinessRanking                           : result,
        forDoingBusinessIndicators                        : result,
        forReformsValidatedByDoingBusiness                : result
    };
}

class ForVia<r> implements ViaChartId<r> {
    constructor(private result: ForChartId<r>) {
    }

    caseOfDistanceToFrontierByIndicator                  () : r { return this.result.forDistanceToFrontierByIndicator                  ; }
    caseOfEnterpriseSurveysTopObstacles                  () : r { return this.result.forEnterpriseSurveysTopObstacles                  ; }
    caseOfGlobalCompetitivenessIndex                     () : r { return this.result.forGlobalCompetitivenessIndex                     ; }
    caseOfGlobalCompetitivenessPillars                   () : r { return this.result.forGlobalCompetitivenessPillars                   ; }
    caseOfOverallDistanceToFrontier                      () : r { return this.result.forOverallDistanceToFrontier                      ; }
    caseOfWorldwideGovernanceIndicators                  () : r { return this.result.forWorldwideGovernanceIndicators                  ; }
    caseOfOpennessToTrade                                () : r { return this.result.forOpennessToTrade                                ; }
    caseOfBiggestRegionalConstraintToFutureInvestment    () : r { return this.result.forBiggestRegionalConstraintToFutureInvestment    ; }
    caseOfReportedRegionalInvestmentChanges              () : r { return this.result.forReportedRegionalInvestmentChanges              ; }
    caseOfControlOfCorruption                            () : r { return this.result.forControlOfCorruption                            ; }
    caseOfFirmsExpectedToPayBribes                       () : r { return this.result.forFirmsExpectedToPayBribes                       ; }
    caseOfContractEnforcementTime                        () : r { return this.result.forContractEnforcementTime                        ; }
    caseOfProtectingMinorityInvestorsIndices             () : r { return this.result.forProtectingMinorityInvestorsIndices             ; }
    caseOfArbitratingCommercialDisputes                  () : r { return this.result.forArbitratingCommercialDisputes                  ; }
    caseOfRegulatoryQuality                              () : r { return this.result.forRegulatoryQuality                              ; }
    caseOfManagementTimeSpentWithRequirementsOfRegulation() : r { return this.result.forManagementTimeSpentWithRequirementsOfRegulation; }
    caseOfNewFirmRegistrationRate                        () : r { return this.result.forNewFirmRegistrationRate                        ; }
    caseOfStartingBusiness                               () : r { return this.result.forStartingBusiness                               ; }
    caseOfConstructionPermittingTime                     () : r { return this.result.forConstructionPermittingTime                     ; }
    caseOfCostOfRegisteringProperty                      () : r { return this.result.forCostOfRegisteringProperty                      ; }
    caseOfCreditToPrivateSector                          () : r { return this.result.forCreditToPrivateSector                          ; }
    caseOfGettingCreditIndices                           () : r { return this.result.forGettingCreditIndices                           ; }
    caseOfLendingVsDepositInterestRates                  () : r { return this.result.forLendingVsDepositInterestRates                  ; }
    caseOfPublicAndPrivateCreditCoverage                 () : r { return this.result.forPublicAndPrivateCreditCoverage                 ; }
    caseOfInsolvencyRecoveryRate                         () : r { return this.result.forInsolvencyRecoveryRate                         ; }
    caseOfStrengthOfInsolvencyFrameworkIndices           () : r { return this.result.forStrengthOfInsolvencyFrameworkIndices           ; }
    caseOfBestPracticesForInvestmentPromotion            () : r { return this.result.forBestPracticesForInvestmentPromotion            ; }
    caseOfForeignEquityOwnershipAllowed                  () : r { return this.result.forForeignEquityOwnershipAllowed                  ; }
    caseOfStartingForeignBusinessEaseEstablishmentIndex  () : r { return this.result.forStartingForeignBusinessEaseEstablishmentIndex  ; }
    caseOfStartingForeignBusinessTimeToStart             () : r { return this.result.forStartingForeignBusinessTimeToStart             ; }
    caseOfStartingForeignBusinessNumberOfProcedures      () : r { return this.result.forStartingForeignBusinessNumberOfProcedures      ; }
    caseOfAccessingIndustrialLand                        () : r { return this.result.forAccessingIndustrialLand                        ; }
    caseOfGettingElectricity                             () : r { return this.result.forGettingElectricity                             ; }
    caseOfElectricityAccess                              () : r { return this.result.forElectricityAccess                              ; }
    caseOfElectricityConsumption                         () : r { return this.result.forElectricityConsumption                         ; }
    caseOfElectricityOutages                             () : r { return this.result.forElectricityOutages                             ; }
    caseOfCostToImportAndExport                          () : r { return this.result.forCostToImportAndExport                          ; }
    caseOfLogisticsPerformanceIndex                      () : r { return this.result.forLogisticsPerformanceIndex                      ; }
    caseOfPayingTaxesHoursPerYear                        () : r { return this.result.forPayingTaxesHoursPerYear                        ; }
    caseOfPayingTaxesRates                               () : r { return this.result.forPayingTaxesRates                               ; }
    caseOfMostProblematicFactors                         () : r { return this.result.forMostProblematicFactors                         ; }
    caseOfDoingBusinessIndicators                        () : r { return this.result.forDoingBusinessIndicators                        ; }
    caseOfDoingBusinessRanking                           () : r { return this.result.forDoingBusinessRanking                           ; }
    caseOfReformsValidatedByDoingBusiness                () : r { return this.result.forReformsValidatedByDoingBusiness                ; }
}

export function forChartId<r>(chartId: string, result: ForChartId<r>) : r {
    return viaChartId(chartId, new ForVia(result));
}