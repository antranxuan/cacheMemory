using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocProModel.Models;

namespace DocproPVEP.Models
{
    public class DocProPVEPDATAContext<T> : DataContext<T> where T : class, new()
    {
        public DocProPVEPDATAContext()
            : base("DATAConnectionString")
        {
        }

    }
}