using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Models.DATA
{
    [PrimaryKey("ID", AutoIncrement = true)]
    [TableName("PhongBan")]
    public class PhongBan: DocProPVEPNhanVienContext<PhongBan>
    {
        [Column]
        public int ID { get; set; }
        [Column]
        public string Name { get; set; }
    }
}