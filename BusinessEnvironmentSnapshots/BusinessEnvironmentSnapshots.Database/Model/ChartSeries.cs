using System.Collections.Generic;
using Newtonsoft.Json;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class ChartSeries
    {
        public string Name { get; set; }
        public SeriesType SeriesType { get; set; }
        public List<Point> Values { get; set; }
        public SerieCountryType SerieCountryType { get; set; }

        [JsonIgnore]
        public int Id { get; set; }

        
    }
}