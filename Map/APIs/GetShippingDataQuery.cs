namespace SyncSoft.Statistics.Map.APIs
{
    public class GetShippingDataQuery
    {
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string DisplayType { get; set; } = string.Empty;
        public string ValueType { get; set; } = string.Empty;
        public string Warehouses { get; set; } = string.Empty;
        public string Carriers { get; set; } = string.Empty;
        public string Customers { get; set; } = string.Empty;
    }
}
