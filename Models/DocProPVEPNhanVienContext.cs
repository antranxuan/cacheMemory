using DocProModel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Models
{
    public class DocProPVEPNhanVienContext<T>: DataContext<T> where T : class, new()
    {
        public DocProPVEPNhanVienContext()
            : base("NhanVienConnectionString")
        {
        }
    }
}