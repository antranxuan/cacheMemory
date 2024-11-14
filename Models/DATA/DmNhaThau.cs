using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PetaPoco;

namespace DocproPVEP.Models.DATA
{
    [PrimaryKey("ID", AutoIncrement = true)]
    [TableName("DmNhaThau")]
    public class DmNhaThau : DocProPVEPDATAContext<DmNhaThau>
    {
        [Column]
        public int ID { get; set; }
        [Column]
        public string MaNhaThau { get; set; }
        [Column]
        public string TenNhaThau { get; set; }
        [Column]
        public string DienThoai { get; set; }
        [Column]
        public string Fax { get; set; }
        [Column]
        public string NguoiDaiDien { get; set; }
        [Column]
        public string NguoiDieuHanh { get; set; }
        [Column]
        public int IDChannel { get; set; }
        [Column]
        public DateTime? Created { get; set; }
        [Column]
        public int CreatedBy { get; set; }
        [Column]
        public DateTime? Updated { get; set; }
        [Column]
        public int UpdatedBy { get; set; }
        [Column]
        public string SearchMeta { get; set; }
        public override List<string> GetFieldSearchs()
        {
            return new List<string>
            {
                "MaNhaThau",
                "TenNhaThau",
                "DienThoai",
                "Fax",
                "NguoiDaiDien",
                "NguoiDieuHanh"
            };
        }
    }
}