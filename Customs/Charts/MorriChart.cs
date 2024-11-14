using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public class MorriChartModel
    {
        /// <summary>
        /// lable trục hoành
        /// </summary>
        public IEnumerable<string> categories { get; set; }
        /// <summary>
        /// data
        /// </summary>
        public List<Series> series { get; set; }
        /// <summary>
        /// tiêu đề cho biểu đồ
        /// </summary>
        public string text { get; set; }
    }
    public class Series
    {
        public string name { get; set; }
        public IEnumerable<int> data { get; set; }
        public string color { get; set; }

    }
    public class Morri
    {
        public string name { get; set; }
        public int y { get; set; }
        public string color { get; set; }

    }
}