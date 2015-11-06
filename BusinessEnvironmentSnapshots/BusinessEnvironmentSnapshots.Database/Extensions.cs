using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    public static class Extensions
    {
        public static async Task<List<T>> ToListAsync<T>(this ObjectResult<T> source)
        {
            var list = new List<T>();
            await Task.Run(() => list.AddRange(source.ToList()));
            return list;
        }

        public static string ToStrWithSuffix(this int? val)
        {
            if (val.HasValue)
            {
                switch (Math.Abs(val.Value)%10)
                {
                    case 1:
                        return val + "st";
                    case 2:
                        return val + "nd";
                    case 3:
                        return val + "rd";
                    default:
                        return val + "th";
                }
            }
            else
            {
                return "";
            }
        }

        public static string RoundAndStringify(this decimal d, string type, int decimals, string format)
        {
            var result = d.ToString("N");
            switch (type)
            {
                case "B":
                    result = Math.Round(d / (decimal)10e9, decimals).ToString(format) + "B";
                    break;
            }

            return result;
        }
    }
}
