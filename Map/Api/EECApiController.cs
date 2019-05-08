using Microsoft.AspNetCore.Mvc;
using SyncSoft.App.Components;
using SyncSoft.Statistics.Map.APIs;
using System;
using System.Threading.Tasks;

namespace SyncSoft.Statistics.Map.Controllers
{
    public class EECApiController : Controller
    {
        // *******************************************************************************************************************************
        #region -  Lazy Object(s)  -

        private static readonly Lazy<IEECApi> _lazyEECApi = ObjectContainer.LazyResolve<IEECApi>();
        private IEECApi _EECApi => _lazyEECApi.Value;

        #endregion

        [HttpGet("api/v1/shipping")]
        public async Task<string> GetShippingDataForMap(GetShippingDataQuery query)
        {
            var json = await _EECApi.GetShippingDataForMapAsync(query).ConfigureAwait(false);
            return json;
        }
    }
}
