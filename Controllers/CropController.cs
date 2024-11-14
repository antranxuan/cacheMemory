using DocProUtil;
using DocProUtil.Cf;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Web.Mvc;

namespace DocproPVEP.Controllers
{
    public class CropController : Controller
    {
        //
        // GET: /Crop/

        public ActionResult Index(string w, string h, string x, string y, string path)
        {
            var cropFolder = string.Format("crop/{0}x{1}-{2}x{3}", w, h, x, y);
            var pathCrop = Path.Combine(
                   GlobalConfig.StgBase,
                   Utils.RealPath(cropFolder),
                   Utils.RealPath(path)
               );
            if (Utils.IsFileExists(pathCrop))
            {
                return Utils.AccessNAS<FileContentResult>(pathCrop, () =>
                {
                    return File(System.IO.File.ReadAllBytes(pathCrop), "image/png");
                });
            }

            var pathSource = Path.Combine(
                GlobalConfig.StgDirFile, 
                Utils.RealPath(path)
            );
            if (!Utils.IsFileExists(pathSource))
                return HttpNotFound();

            var width = 0;
            var height = 0;
            if (Utils.IsNumber(w))
                width = int.Parse(w);
            if (Utils.IsNumber(h))
                height = int.Parse(h);
            if (width <= 0 || height <= 0)
                return HttpNotFound();

            var pointX = 0;
            var pointY = 0;
            if (Utils.IsNumber(x))
                pointX = int.Parse(x);
            if (Utils.IsNumber(y))
                pointY = int.Parse(y);

            try
            {
                return Utils.AccessNAS<FileContentResult>(pathSource, () =>
                {
                    using (FileStream fs = new FileStream(pathSource, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                    {
                        using (var originalImage = Image.FromStream(fs))
                        {
                            var srcWidth = originalImage.Width;
                            var srcHeight = originalImage.Height;
                            if (x.ToLowerInvariant() == "c")
                            {
                                pointX = (srcWidth - width) / 2;
                            }
                            if (y.ToLowerInvariant() == "c")
                            {
                                pointY = (srcHeight - height) / 2;
                            }

                            using (var bmp = new Bitmap(width, height))
                            {
                                bmp.SetResolution(originalImage.HorizontalResolution, originalImage.VerticalResolution);
                                using (var graphic = Graphics.FromImage(bmp))
                                {
                                    graphic.SmoothingMode = SmoothingMode.Default;
                                    graphic.InterpolationMode = InterpolationMode.Default;
                                    graphic.PixelOffsetMode = PixelOffsetMode.HighSpeed;
                                    graphic.DrawImage(originalImage, new Rectangle(0, 0, width, height), pointX, pointY, width, height, GraphicsUnit.Pixel);

                                    var dirname = Path.GetDirectoryName(pathCrop);
                                    if (dirname != null)
                                        Directory.CreateDirectory(dirname);

                                    bmp.Save(pathCrop, ImageFormat.Jpeg);
                                    return File(System.IO.File.ReadAllBytes(pathCrop), "image/jpeg");
                                }
                            }
                        }
                    }
                });
            }
            catch
            {
                return HttpNotFound();
            }
        }

    }
}
