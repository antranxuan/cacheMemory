using System.Collections.Generic;
using System.Linq;

namespace DocproPVEP.Customs.Params
{
    public class DeleteParam
    {
        public long ID { get; set; }
        public string IDFile { get; set; }
        public string RedirectPath { get; set; }

        public string Action { get; set; }
        public string Title { get; set; }
        public string ConfTitle { get; set; }
        public string BackTitle { get; set; }

        public string TargetDelete { get; set; }
        public bool IsQuickSubmit { get; set; }
    }
    public class DeletesParam
    {
        public long[] ID { get; set; }
        public string[] IDFile { get; set; }
        public string RedirectPath { get; set; }

        public string Action { get; set; }
        public string Title { get; set; }
        public string ConfTitle { get; set; }
        public string BackTitle { get; set; }

        public int[] IDToInts()
        {
            var ids = new List<int>();
            foreach (var id in ID)
                ids.Add((int)id);

            return ids.ToArray();
        }

        public bool HasID
        {
            get
            {
                return !Equals(ID, null) && ID.Any();
            }
        }
        public bool HasIDFile
        {
            get
            {
                return !Equals(IDFile, null) && IDFile.Any();
            }
        }
    }
}