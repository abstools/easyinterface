import unittest
import xml.etree.ElementTree as ET
import eiol


class TestEIOL(unittest.TestCase):
    def test_root(self):
        root = eiol.create_output()
        rootstr = ET.tostring(root, encoding='utf8', method='xml')
        solution = "<?xml version='1.0' encoding='utf8'?>"\
                   "<eiout />"

        self.assertEqual(rootstr.replace('\n', ''),
                         solution.replace('\n', ''))

    def test_root_version(self):
        root = eiol.create_output(version='1.0')
        rootstr = ET.tostring(root, encoding='utf8', method='xml')
        solution = "<?xml version='1.0' encoding='utf8'?>"\
                   '<eiout version="1.0" />'

        self.assertEqual(rootstr.replace('\n', ''),
                         solution.replace('\n', ''))

    def test_eicommands_dest(self):
        root = eiol.eicommands(dest="/path/to/file")
        rootstr = ET.tostring(root, encoding='utf8', method='xml')
        solution = "<?xml version='1.0' encoding='utf8'?>"\
                   '<eicommands dest="/path/to/file" />'

        self.assertEqual(rootstr.replace('\n', ''),
                         solution.replace('\n', ''))
