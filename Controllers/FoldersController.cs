using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace FolderApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FoldersController : ControllerBase
    {
        private readonly string basePath = Path.Combine(Directory.GetCurrentDirectory(), "storage");

        public FoldersController()
        {
            if (!Directory.Exists(basePath))
                Directory.CreateDirectory(basePath);
        }

        // GET /folders
        [HttpGet]
        public IActionResult GetFolders()
        {
            var folders = Directory.GetDirectories(basePath)
                .Select(Path.GetFileName)
                .ToList();
            return Ok(folders);
        }

        // POST /folders
        [HttpPost]
        public IActionResult CreateFolder([FromBody] string folderName)
        {
            if (string.IsNullOrWhiteSpace(folderName))
                return BadRequest("Folder name is required.");
            var newFolderPath = Path.Combine(basePath, folderName);
            if (Directory.Exists(newFolderPath))
                return Conflict("Folder already exists.");
            Directory.CreateDirectory(newFolderPath);
            return Ok($"Folder '{folderName}' created.");
        }

        // PUT /folders/{folderName}
        [HttpPut("{folderName}")]
        public IActionResult RenameFolder(string folderName, [FromBody] string newFolderName)
        {
            if (string.IsNullOrWhiteSpace(newFolderName))
                return BadRequest("New folder name is required.");
            var oldFolderPath = Path.Combine(basePath, folderName);
            var newFolderPath = Path.Combine(basePath, newFolderName);
            if (!Directory.Exists(oldFolderPath))
                return NotFound("Folder not found.");
            if (Directory.Exists(newFolderPath))
                return Conflict("A folder with the new name already exists.");
            Directory.Move(oldFolderPath, newFolderPath);
            return Ok($"Folder '{folderName}' renamed to '{newFolderName}'.");
        }

        // DELETE /folders/{folderName}
        [HttpDelete("{folderName}")]
        public IActionResult DeleteFolder(string folderName)
        {
            var folderPath = Path.Combine(basePath, folderName);
            if (!Directory.Exists(folderPath))
                return NotFound("Folder not found.");
            Directory.Delete(folderPath, true);
            return Ok($"Folder '{folderName}' deleted.");
        }
    }
} 