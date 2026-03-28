import io
from django.http import FileResponse
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from .models import Certificate

@login_required
def certificate_list(request):
    certificates = Certificate.objects.filter(student=request.user).select_related('course')
    return render(request, 'certificates/list.html', {'certificates': certificates})

@login_required
def download_certificate(request, cert_uuid):
    certificate = get_object_or_404(Certificate, certificate_id=cert_uuid, student=request.user)
    
    # Create a file-like buffer to receive PDF data.
    buffer = io.BytesIO()

    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)

    # 1. Background Border
    p.setStrokeColor(colors.indigo)
    p.setLineWidth(5)
    p.rect(20, 20, width-40, height-40)
    
    # 2. Interior Border
    p.setStrokeColor(colors.gold)
    p.setLineWidth(2)
    p.rect(35, 35, width-70, height-70)

    # 3. Header
    p.setFont("Helvetica-Bold", 40)
    p.drawCentredString(width/2, height - 120, "CERTIFICATE OF COMPLETION")
    
    p.setFont("Helvetica", 18)
    p.drawCentredString(width/2, height - 160, "This is to certify that")

    # 4. Student Name
    p.setFont("Helvetica-Bold", 48)
    p.setFillColor(colors.black)
    p.drawCentredString(width/2, height - 230, certificate.student.get_full_name() or certificate.student.username)

    # 5. Course Name
    p.setFont("Helvetica", 18)
    p.drawCentredString(width/2, height - 280, "has successfully completed the course")
    
    p.setFont("Helvetica-Bold", 32)
    p.setFillColor(colors.indigo)
    p.drawCentredString(width/2, height - 340, certificate.course.title.upper())

    # 6. Footer Details
    p.setFont("Helvetica", 12)
    p.setFillColor(colors.gray)
    p.drawCentredString(width/2, 100, f"Issued on: {certificate.issued_at.strftime('%B %d, %Y')}")
    p.drawCentredString(width/2, 80, f"Verification ID: {certificate.certificate_id}")

    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()

    # FileResponse sets the Content-Disposition header so that browsers
    # present the option to save the file.
    buffer.seek(0)
    filename = f"certificate_{certificate.student.username}_{certificate.course.id}.pdf"
    return FileResponse(buffer, as_attachment=True, filename=filename)
