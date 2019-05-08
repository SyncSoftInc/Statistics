using Microsoft.AspNetCore.Mvc;

namespace SyncSoft.Statistics.Map.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
