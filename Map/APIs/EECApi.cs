using Microsoft.Extensions.Configuration;
using SyncSoft.App.Components;
using SyncSoft.App.Http;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace SyncSoft.Statistics.Map.APIs
{
    public interface IEECApi
    {
        Task<string> GetShippingDataForMapAsync(GetShippingDataQuery query);
    }

    public class EECApi : HttpClientBase, IEECApi
    {
        // *******************************************************************************************************************************
        #region -  Lazy Object(s)  -

        private static readonly Lazy<IConfiguration> _lazyConfiguration = ObjectContainer.LazyResolve<IConfiguration>();
        private IConfiguration _Configuration => _lazyConfiguration.Value;

        #endregion
        // *******************************************************************************************************************************
        #region -  Field(s)  -

        private static readonly object _locker = new object();
        private static readonly HttpClient _client = new HttpClient();

        private static volatile BasicHttpAuthorization _auth;
        private static volatile Uri _uri;

        #endregion
        // *******************************************************************************************************************************
        #region -  Constructor(s)  -

        public EECApi()
        {
            if (null == _auth)
            {
                lock (_locker)
                {
                    if (null == _auth)
                    {
                        var config = _Configuration.GetSection("Config");

                        var clientId = config["ClientID"];
                        var clientSecret = config["ClientSecret"];

                        _auth = new BasicHttpAuthorization(clientId, clientSecret);

                        var uri = config["Uri"];
                        _uri = new Uri(uri);
                    }
                }
            }
        }


        #endregion
        // *******************************************************************************************************************************
        #region -  GetShippingDataForMap  -

        public async Task<string> GetShippingDataForMapAsync(GetShippingDataQuery query)
        {
            var request = await base.CreateHttpRequestMessage(authorization: _auth
                , httpMethod: HttpMethod.Post
                , uri: _uri
                , data: null
                , correlationId: null
            );
            request.AttachJsonContent(query);

            var responseMessage = await base.SendAsync(request).ConfigureAwait(false);                           // 发送消息
            return await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
        }

        #endregion
    }
}
