using System.Collections.Generic;

namespace DocproPVEP.Customs.Charts
{
    public class PlotChart
    {
        /// <summary>
        /// số liệu
        /// </summary>
        public object data { get; set; }
        /// <summary>
        /// tiêu đề
        /// </summary>
        public string label { get; set; }
        /// <summary>
        /// Giá trị màu
        /// </summary>
        public List<string> colors { get; set; }
        public string color { get; set; }
    }
}