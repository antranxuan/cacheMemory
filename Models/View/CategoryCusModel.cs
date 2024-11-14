using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DocProModel.Models;

namespace DocproPVEP.Models.View
{
    public class CategoryCusModel
    {
        public List<Category> categories { get; set; }
        public Category categorie { get; set; }
        public string ActionLinkSearch { get; set; }
        public string Url { get; set; }
        public int Action { get; set; }
    }
}