using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessEnvironmentSnapshots.Database.DB;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        private static void GetCategoryOrder(int requestedCountryId, IEnumerable<GetValuesResult> cleanedData, Dictionary<int, GetCountriesInfo_Result> countries,
            List<GetCountriesInfo_Result> countryList, bool reverse, out List<int> categoryIds)
        {
            categoryIds = new List<int> { requestedCountryId };
            var regionData =
                cleanedData.Where(d => countries[d.CountryId].CountryType > 1 && countries[d.CountryId].CountryType < 9)
                    .ToList();
            if (regionData.Count > 0)
            {
                categoryIds.Add(regionData.First().CountryId);
            }

            var comparators = countryList.Where(c => c.CountryType == 1).ToList();
            if (comparators.Count > 0)
            {
                var compIds = comparators.Select(c => c.CountryId).Distinct().ToList();
                var maximums =
                    cleanedData.GroupBy(d => d.CountryId)
                        .SelectMany(
                            group =>
                                @group.Where(g => g.Year == @group.Max(a => a.Year) && compIds.Contains(g.CountryId)))
                        .Distinct().OrderBy(v => v.IndicatorValue)
                        .ToList();
                if (reverse)
                {
                    maximums.Reverse();
                }
                categoryIds.AddRange(maximums.Select(a => a.CountryId));

            }
        }

        private static void GetCategoryOrderByTotal(int requestedCountryId, IEnumerable<GetValuesResult> cleanedData, Dictionary<int, GetCountriesInfo_Result> countries,
            List<GetCountriesInfo_Result> countryList, bool reverse, out List<int> categoryIds)
        {
            categoryIds = new List<int> { requestedCountryId };
            var regionData =
                cleanedData.Where(d => countries[d.CountryId].CountryType > 1 && countries[d.CountryId].CountryType < 9)
                    .ToList();
            if (regionData.Count > 0)
            {
                categoryIds.Add(regionData.First().CountryId);
            }

            var comparators = countryList.Where(c => c.CountryType == 1).ToList();
            if (comparators.Count > 0)
            {
                var compIds = comparators.Select(c => c.CountryId).Distinct().ToList();
                var maximums =
                    cleanedData.Where(g => compIds.Contains(g.CountryId)).GroupBy(d => d.CountryId).Select(
                            group => new Tuple<int, decimal>(@group.Key, @group.Sum(g => g.IndicatorValue ?? 0)))
                        .Distinct().OrderBy(v => v.Item2)
                        .ToList();
                if (reverse)
                {
                    maximums.Reverse();
                }
                categoryIds.AddRange(maximums.Select(a => a.Item1));

            }
        }

        private static void GetCategoryOrder(IEnumerable<GetValuesResult> cleanedData, List<int> indicatorIds,  bool inDescendingOrder, out List<int> categoryIds)
        {
			categoryIds = new List<int>();
            var maximums =
                cleanedData.Where(c => indicatorIds.Contains(c.IndicatorId)).GroupBy(d => d.IndicatorId)
                    .SelectMany(
                        group =>
                            @group.Where(g => g.Year == @group.Max(a => a.Year)))
                    .Distinct().OrderBy(v => v.IndicatorValue)
                    .ToList();
            if (inDescendingOrder)
            {
                maximums.Reverse();
            }
            categoryIds.AddRange(maximums.Select(a => a.IndicatorId));
        }
    }
}
