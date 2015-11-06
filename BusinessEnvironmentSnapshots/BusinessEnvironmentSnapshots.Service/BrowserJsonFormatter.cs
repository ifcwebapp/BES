using System;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;

namespace BusinessEnvironmentSnapshots.Service
{
    public class BrowserJsonFormatter : JsonMediaTypeFormatter
    {
        public BrowserJsonFormatter()
        {
            var camelCaseResolver = new CamelCasePropertyNamesContractResolver();
            this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            this.SerializerSettings.ContractResolver = camelCaseResolver;
            this.SerializerSettings.Formatting = Formatting.Indented;
            // AB: don't really need this: this.SerializerSettings.Converters.Add(new StringEnumConverter { CamelCaseText = true });
        }

        public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers, MediaTypeHeaderValue mediaType)
        {
            base.SetDefaultContentHeaders(type, headers, mediaType);
            headers.ContentType = new MediaTypeHeaderValue("application/json");
        }
    }
}