using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocProKTNN.Customs.Charts
{
    public class DashboardChart
    {
        public int Year { get; set; }
        public int UnActive { get; set; }
        public int InActive { get; set; }
        public int FinActive { get; set; }
        public int DoanRa { get; set; }
        public int DoanVao { get; set; }
        public int HoiThao { get; set; }
        public int DaoTao { get; set; }
        public int BienDich { get; set; }
        public int HopTac { get; set; }
        public int HtDoanRa { get; set; }
        public int HtDoanVao { get; set; }
    }

    public class ProjectPlanChart
    {
        public int Year { get; set; }
        public int UnProject { get; set; }
        public int InProject { get; set; }
        public int FinProject { get; set; }
        public int UnProjectActive { get; set; }
        public int InProjectActive { get; set; }
        public int FinProjectActive { get; set; }
        public int UnProjectPlanActive { get; set; }
        public int InProjectPlanActive { get; set; }
        public int FinProjectPlanActive { get; set; }

        public int Projects { get; set; }
        public int ProjectActive { get; set; }
        public int ProjectPlanActive { get; set; }
    }
}