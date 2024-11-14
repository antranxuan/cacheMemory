using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PetaPoco;

namespace DocproPVEP.Models.DATA
{
    [PrimaryKey("ID", AutoIncrement = true)]
    [TableName("NhanVien")]
    public class NhanVien : DocProPVEPNhanVienContext<NhanVien>
    {
        [Column]
        public int ID { get; set; }
        [Column]
        public string Name { get; set; }
        [Column]
        public bool Sex { get; set; }
        [Column]
        public string Phone { get; set; }
        [Column]
        public float Salary { get; set; }
        [Column]
        public string Address { get; set; }
        [Column]
        public DateTime? Created { get; set; }
        [Column]
        public DateTime? Updated { get; set; }
        [Column]
        public string SearchMeta { get; set; }
        [Column]
        public int IDPhongBan { get; set; }
        public override List<string> GetFieldSearchs()
        {
            return new List<string>
            {
                "Name",
             
            };
        }
    }
}