#[tauri::command]
pub fn open_link_on_click(url: &str) -> Result<(), String> {
    webbrowser::open(url).map_err(|e| e.to_string())
}