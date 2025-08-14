using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace FolderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public AdminController(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        private bool ValidateToken()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return false;
                }

                var token = authHeader.Substring("Bearer ".Length);
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "sua-chave-secreta-muito-longa-aqui");

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpPut("content")]
        public IActionResult UpdateContent([FromBody] object content)
        {
            Console.WriteLine("=== UpdateContent chamado ===");
            Console.WriteLine($"Headers: {string.Join(", ", Request.Headers.Select(h => $"{h.Key}={h.Value}"))}");

            if (!ValidateToken())
            {
                Console.WriteLine("Token inválido");
                return Unauthorized(new { message = "Token de autenticação inválido" });
            }

            Console.WriteLine("Token válido, processando conteúdo...");

            try
            {
                // Salvar conteúdo em arquivo JSON
                var contentPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "data", "content.json");
                var directory = Path.GetDirectoryName(contentPath);

                Console.WriteLine($"Content path: {contentPath}");
                Console.WriteLine($"Directory: {directory}");

                if (!Directory.Exists(directory))
                {
                    Console.WriteLine("Criando diretório...");
                    Directory.CreateDirectory(directory!);
                }

                var jsonString = JsonSerializer.Serialize(content, new JsonSerializerOptions { WriteIndented = true });
                Console.WriteLine($"JSON a ser salvo: {jsonString}");

                System.IO.File.WriteAllText(contentPath, jsonString);
                Console.WriteLine("Arquivo salvo com sucesso");

                return Ok(new { message = "Conteúdo atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao salvar: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Erro ao salvar conteúdo", error = ex.Message });
            }
        }

        [HttpGet("content")]
        public IActionResult GetContent()
        {
            try
            {
                var contentPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "data", "content.json");

                if (!System.IO.File.Exists(contentPath))
                {
                    // Retornar conteúdo padrão se não existir arquivo
                    var defaultContent = new
                    {
                        name = "Tamy Niwa",
                        title = "Personal Trainer Profissional",
                        description = "Transforme seu corpo e sua vida com treinos personalizados e acompanhamento especializado",
                        about = new[]
                        {
                            "Treinos, motivação, lifestyle CF LV1 trainer Cwb gymnastic LV1 Liberacao Miofascia.",
                            "Allan Joseph X-mobillity - mobilidade",
                            "Pós graduação: Alta Performance em Prescrição de Treinos e Exercícios: Hipertrofia, Saúde e Emagrecimento",
                            "\"Manter o corpo em boa saúde é um dever… caso contrário, não seremos capazes de manter nossa mente forte e clara\".  - Buda"
                        },
                        services = new[]
                        {
                            new
                            {
                                title = "Treino Presencial",
                                description = "Acompanhamento individualizado com treinos personalizados na academia ou ao ar livre.",
                                features = new[] { "Avaliação física completa", "Treinos personalizados", "Acompanhamento nutricional básico", "Suporte via WhatsApp" }
                            },
                            new
                            {
                                title = "Treino Online",
                                description = "Treinos personalizados para você fazer em casa ou na academia com acompanhamento remoto.",
                                features = new[] { "Treinos personalizados", "Vídeos explicativos", "Acompanhamento semanal", "Suporte 24/7" }
                            },
                            new
                            {
                                title = "Consultoria",
                                description = "Orientação especializada para otimizar seus treinos e resultados.",
                                features = new[] { "Análise de treinos", "Dicas de nutrição", "Planejamento de metas", "Suporte por 30 dias" }
                            }
                        },
                        contact = new
                        {
                            whatsapp = "(11) 99999-9999",
                            instagram = "@tamyniwa_personal",
                            email = "tamyniwa@gmail.com"
                        },
                        stats = new
                        {
                            clients = "100+",
                            experience = "5+",
                            commitment = "100%"
                        }
                    };

                    return Ok(defaultContent);
                }

                var jsonString = System.IO.File.ReadAllText(contentPath);
                var content = JsonSerializer.Deserialize<JsonElement>(jsonString);

                return Ok(content);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao carregar conteúdo", error = ex.Message });
            }
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (!ValidateToken())
            {
                return Unauthorized(new { message = "Token de autenticação inválido" });
            }

            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "Nenhum arquivo foi enviado" });
                }

                // Validar tipo de arquivo
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new { message = "Tipo de arquivo não permitido. Use apenas JPG, PNG ou GIF." });
                }

                // Validar tamanho (máximo 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Arquivo muito grande. Tamanho máximo: 5MB" });
                }

                // Criar pasta de uploads se não existir
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Gerar nome único para o arquivo
                var fileName = $"profile-photo-{DateTime.Now:yyyyMMdd-HHmmss}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Salvar arquivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar URL da imagem
                var imageUrl = $"/uploads/{fileName}";

                return Ok(new
                {
                    message = "Foto enviada com sucesso",
                    imageUrl = imageUrl,
                    fileName = fileName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao fazer upload da foto", error = ex.Message });
            }
        }

        [HttpGet("current-photo")]
        public IActionResult GetCurrentPhoto()
        {
            try
            {
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
                var profilePhotos = Directory.GetFiles(uploadsPath, "profile-photo-*")
                    .OrderByDescending(f => System.IO.File.GetLastWriteTime(f))
                    .FirstOrDefault();

                if (profilePhotos == null)
                {
                    return NotFound(new { message = "Nenhuma foto encontrada" });
                }

                var fileName = Path.GetFileName(profilePhotos);
                var imageUrl = $"/uploads/{fileName}";

                return Ok(new { imageUrl = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar foto atual", error = ex.Message });
            }
        }
    }
}