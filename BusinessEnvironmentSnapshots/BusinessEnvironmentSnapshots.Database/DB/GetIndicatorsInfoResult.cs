using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.DB
{
    public class GetIndicatorsInfoResult
    {
        public int IndicatorId { get; set; }
        public string IndicatorName { get; set; }
        public int IndicatorSourceId { get; set; }
        public string IndicatorAlias { get; set; }
        public bool IsSupportedIndicator { get; set; }
        public int? IndicatorGroupId { get; set; }
        public string IndicatorGroupName { get; set; }

        public string Name 
        {
            get { return IndicatorAlias ?? IndicatorName; }
        }
    }
}
