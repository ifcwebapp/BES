//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BusinessEnvironmentSnapshots.Database
{
    using System;
    
    public partial class GetCountriesInfo_Result
    {
        public int CountryId { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public Nullable<int> RegionId { get; set; }
        public Nullable<int> IncomeId { get; set; }
        public Nullable<int> LowIncomeRegionId { get; set; }
        public Nullable<int> EconomicalRegionId { get; set; }
        public string CountryAlias { get; set; }
        public string RegionName { get; set; }
        public Nullable<bool> IsEconomical { get; set; }
        public Nullable<int> WdiRegionId { get; set; }
        public Nullable<int> AvgRegionId { get; set; }
        public Nullable<int> AvgdRegionId { get; set; }
        public Nullable<int> EsRegionId { get; set; }
        public int CountryType { get; set; }
        public string IncomeName { get; set; }
        public Nullable<int> WdiIncomeId { get; set; }
        public Nullable<int> AvgIncomeId { get; set; }
        public Nullable<int> EsIncomeId { get; set; }
        public int WdiWorldId { get; set; }
        public int EsWorldId { get; set; }
    }
}
