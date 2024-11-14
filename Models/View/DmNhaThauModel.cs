using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocproPVEP.Models.DATA;

namespace DocproPVEP.Models.View
{
    public class DmNhaThauModel
    {

        public List<DmNhaThau> DmNhaThaus { get; set; }
        public DmNhaThau DmNhaThau { get; set; }
        public string ActionLinkSearch { get; set; }
        public string Url { get; set; }
        public int Action { get; set; }
    }
}