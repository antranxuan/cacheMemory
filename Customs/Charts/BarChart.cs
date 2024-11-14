using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public class BarChartModel
    {
        public List<KDChart> data { get; set; }
        public string xkey { get; set; }
        public List<string> ykeys { get; set; }
        public List<string> labels { get; set; }
        public List<string> barColors { get; set; }
        public string[] categories { get; set; }
        public List<Series> series { get; set; }
        public string text { get; set; }
    }
}