using DocproPVEP.Models.DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Models.View
{
    public class NhanVienModel
    {
        public List<NhanVien> NhanViens { get; set; }
        public List<PhongBan> PhongBans { get; set; }
        public NhanVien NhanVien { get; set; }
        public string ActionLinkSearch { get; set; }
        public string Url { get; set; }
        public int Action { get; set; }
    }
}