using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace BusinessEnvironmentSnapshots.Database
{
    static class ChartConfigParser
    {
        public static Dictionary<string, Dictionary<string, List<string>>> GetChartConfig(string chartName)
        {
            var path = "";
            if (HttpContext.Current != null)
            {
                path = HttpContext.Current.Server.MapPath("~/App_Data/ChartConfig");
            }
            else
            {
                path = ConfigurationManager.AppSettings["ChartConfigPath"];
            }
            var result = new Dictionary<string, Dictionary<string, List<string>>>();
            using (var sr = new StreamReader(path + "\\" + chartName + ".txt"))
            {
                string line;
                var currentSection = new Dictionary<string, List<string>>();
                result.Add("", currentSection);
                while ((line = sr.ReadLine()) != null)
                {
                    line = line.Trim();
                    if (line != String.Empty)
                    {
                        if (line.StartsWith("["))
                        {
                            string sectionName = line.Replace("[", "").Replace("]", "");
                            currentSection = new Dictionary<string, List<string>>();
                            result.Add(sectionName, currentSection);
                        }
                        else
                        {
                            var arr = line.Split('=');
                            var name = arr[0];
                            var val = String.Join("=", arr.Skip(1));
                            if (currentSection.ContainsKey(name))
                            {
                                currentSection[name].Add(val);
                            }
                            else
                            {
                                currentSection.Add(name, new List<string> {val});
                            }
                        }
                    }
                }
            }

            return result;
        }

        

        public static string GetValue(this Dictionary<string, Dictionary<string, List<string>>> config, 
            string valName,
            string section = "",
            string defaultValue = null)
        {
            List<string> vals;
            if (config[section].TryGetValue(valName, out vals))
            {
                return vals[0]; 
            }

            return defaultValue;

        }

        public static int? GetValueAsNullableInt(this Dictionary<string, Dictionary<string, List<string>>> config,
            string valName,
            string section = "",
            int? defaultValue = null)
        {
            List<string> vals;
            int val;
            if (config[section].TryGetValue(valName, out vals) && !String.IsNullOrEmpty(vals[0]) && Int32.TryParse(vals[0], out val))
            {
                return val;
            }

            return defaultValue;

        }

        public static List<string> GetValues(this Dictionary<string, Dictionary<string, List<string>>> config, 
            string valName,
            string section = "")
        {
            List<string> vals;
            if (config[section].TryGetValue(valName, out vals))
            {
                return vals;
            }

            return null;

        }

        public static List<int> GetValuesAsInt(this Dictionary<string, Dictionary<string, List<string>>> config,
            string valName,
            string section = "")
        {
            List<string> vals;
            if (config[section].TryGetValue(valName, out vals))
            {
                return vals.Select(Int32.Parse).ToList();
            }

            return null;

        }

        
    }
}
