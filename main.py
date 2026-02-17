
import webview
import os
import sys

def get_resource_path(relative_path):
    """ Obtener ruta absoluta para recursos, funciona para dev y para PyInstaller """
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

def start_app():
    # Cargar el archivo index.html
    html_file = get_resource_path("index.html")
    
    # Crear la ventana de la aplicación
    window = webview.create_window(
        'OmniFix AI | Suite Forense v3.0',
        'http://localhost:3000',
        width=1200, 
        height=800,
        background_color='#050507',
        resizable=True
    )
    
    # Iniciar la interfaz
    webview.start()

if __name__ == '__main__':
    start_app()
