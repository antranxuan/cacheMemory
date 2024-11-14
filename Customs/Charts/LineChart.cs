using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public class LineChart
    {
        /// <summary>
        /// số liệu
        /// </summary>
        public List<Series> series { get; set; }
        /// <summary>
        /// tiêu đề
        /// </summary>
        public string title { get; set; }

        public List<string> categories { get; set; }
        public List<string> colors { get; set; }
    }
}