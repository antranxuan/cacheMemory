using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public class PieChart
    {
        public object data { get; set; }
        public string label { get; set; }
        public string color { get; set; }
        public List<string> colors { get; set; }
    }
}