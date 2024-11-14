using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DocproPVEP.Customs.Entities
{
    public class ExportWordTableEntity
    {
        public string TableName { get; set; }
        public List<ExportWordCommon> TableContain { get; set; }

        /// <summary>
        /// Start row to write data (start from 0)
        /// </summary>
        public int StartRowIndex { get; set; }
        /// <summary>
        /// Xóa dòng cuối?
        /// </summary>
        public bool RemoveLastRow { get; set; }
    }
    public class ExportWordCommon
    {
        public string Key { get; set; }
        public List<ItemWord> ItemWords { get; set; }
    }
    public class ItemWord
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}